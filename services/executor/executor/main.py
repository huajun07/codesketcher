import os
import bdb
import inspect
import json
import sys
from io import StringIO
from contextlib import redirect_stdout

CODE_FILENAME = "user_code"


class Debugger(bdb.Bdb):
    def __init__(self):
        # Skip modules added in AWS Lambda's runtime
        super().__init__(skip=["awslambdaric.bootstrap"])
        self.root_frame = None
        self.is_tracing = False
        self.done = False
        self.previous_frame = None
        self.previous_line_number = -1
        self.data = []
        self.previous_function_scope = []  # e.g. ["f1", "f2"]. Empty if not in function
        self.previous_local_variables_stack = [{}]
        self.previous_global_variables = {}
        self.current_raw_local_variables = {}
        self.current_raw_global_variables = {}

    # This function takes in a dictionary of variables and clones them
    # into a predefined format that can be serialized into JSON data.
    def clone_variables(self, variables_dict):
        def convert_variable(variable):
            match variable:
                case bool() | int() | float() | str():
                    value = variable

                case dict():
                    value = {
                        child_key: convert_variable(child_variable)
                        for child_key, child_variable in variable.items()
                    }

                case list() | set() | tuple():
                    value = list(map(convert_variable, variable))

                case _:
                    try:
                        value = variable.__str__()
                    except Exception:
                        value = "error: could not convert to string"
            return {"type": type(variable).__name__, "value": value}

        return {key: convert_variable(value) for key, value in variables_dict.items()}

    def get_scope(self, frame):
        if frame == self.root_frame or frame == self.root_frame.f_back:
            return []
        return self.get_scope(frame.f_back) + [frame.f_code.co_name]

    # Checks if the frame is of interest (i.e. originates from user code)
    def frame_check(self, frame):
        if frame.f_code.co_filename != CODE_FILENAME:
            return False
        return True

    def user_return(self, frame, return_value):
        # Since local variables are dropped upon returning, we need to capture them here
        if len(self.get_scope(frame)) == len(self.previous_function_scope):
            self.current_raw_local_variables |= frame.f_locals
            self.current_raw_global_variables |= frame.f_globals

    def user_line(self, frame):
        if not self.is_tracing:
            # First tiime this function is called (from the caller's frame), setup everything
            self.set_trace()
            self.root_frame = frame
            self.is_tracing = True
            self.previous_frame = frame
            self.previous_line_number = frame.f_lineno
            return

        if not self.frame_check(frame) and not frame == self.root_frame.f_back:
            # Only consider lines from the user's code (or the root frame's parent, when execution is done)
            return

        if self.done:
            # Code has finished executing, any further lines are from caller's frame and should be ignored
            return

        current_scope = self.previous_function_scope
        while len(current_scope) + 1 < len(self.previous_local_variables_stack):
            self.previous_local_variables_stack.pop()
        while len(current_scope) + 1 > len(self.previous_local_variables_stack):
            self.previous_local_variables_stack.append({})

        if len(self.previous_function_scope) <= len(self.get_scope(frame)):
            if "__name__" in frame.f_globals and frame.f_globals["__name__"] == "bdb":
                # Code has finished executing, frame is caller's frame, hence we take frame.f_locals["locals"] instead
                self.current_raw_local_variables |= frame.f_locals["locals"]
                self.current_raw_global_variables |= frame.f_locals["globals"]
                self.done = True
            else:
                self.current_raw_local_variables |= frame.f_locals
                self.current_raw_global_variables |= frame.f_globals
        self.current_raw_global_variables.pop("__builtins__", None)
        self.current_raw_local_variables.pop("__builtins__", None)

        def filter_variable(x):
            if inspect.ismodule(x):
                return True
            if "importlib" in type(x).__module__:
                return True
            return False

        for name in list(self.current_raw_global_variables.keys()):
            if filter_variable(self.current_raw_global_variables[name]):
                self.current_raw_global_variables.pop(name, None)
        for name in list(self.current_raw_local_variables.keys()):
            if filter_variable(self.current_raw_local_variables[name]):
                self.current_raw_local_variables.pop(name, None)

        local_variables = self.clone_variables(self.current_raw_local_variables)
        global_variables = self.clone_variables(self.current_raw_global_variables)

        local_variable_changes = {}
        global_variable_changes = {}

        previous_local_variables = self.previous_local_variables_stack[-1]
        for var in self.current_raw_local_variables:
            if (
                var in previous_local_variables
                and previous_local_variables[var] == local_variables[var]
            ):
                continue
            local_variable_changes[var] = local_variables[var]

        for var in self.current_raw_global_variables:
            if (
                var in self.previous_global_variables
                and self.previous_global_variables[var] == global_variables[var]
            ):
                continue
            global_variable_changes[var] = global_variables[var]

        if self.root_frame == self.previous_frame:
            # In the root frame, all local variables are also global variables.
            # Hence we treat all changes as local, to avoid repeated output
            global_variable_changes = {}
        self.previous_frame = frame

        self.data.append(
            {
                "line_number": self.previous_line_number,
                "local_variable_changes": local_variable_changes,
                "global_variable_changes": global_variable_changes,
                "function_scope": self.previous_function_scope,
            }
        )

        current_scope = self.get_scope(frame)
        while len(current_scope) + 1 > len(self.previous_local_variables_stack):
            self.previous_local_variables_stack.append({})

        self.previous_function_scope = current_scope
        self.previous_line_number = frame.f_lineno
        self.previous_local_variables_stack[-1] = local_variables
        self.previous_global_variables = global_variables
        self.current_raw_local_variables = {}
        self.current_raw_global_variables = {}


def json_size_checker(return_data):
    json_string = json.dumps(return_data)
    if len(json_string) > 1024 * 1024:
        # json_string exceeds 1MB in length
        return {
            "executed": return_data["executed"],
            "error": "Too much data was generated! Please don't overload our servers ):",
        }
    return return_data


def prepare_environment():
    for env in os.environ.keys():
        del os.environ[env]


def execute(event):
    prepare_environment()
    if not isinstance(event, dict):
        return {"executed": False, "error": "Input event is not a dictionary"}

    code = event.get("code")
    inp = event.get("input", "")

    if not isinstance(code, str):
        return {"executed": False, "error": "Field 'code' must be a string"}
    if not isinstance(inp, str):
        return {"executed": False, "error": "Field 'input' must be empty or a string"}

    sys.stdin = StringIO(inp)
    output = StringIO()
    debugger = Debugger()

    with redirect_stdout(output):
        try:
            empty_dict = {}
            # At the top level, globals == locals. Hence both must reference the same dictionary.
            debugger.run(
                compile(code, filename=CODE_FILENAME, mode="exec"),
                globals=empty_dict,
                locals=empty_dict,
            )
            return json_size_checker(
                {
                    "executed": True,
                    "data": debugger.data,
                    "output": output.getvalue(),
                }
            )
        except SyntaxError as error:
            # Syntax errors will cause the code to not run at all (i.e. data and output are empty)
            return json_size_checker(
                {
                    "executed": False,
                    "data": debugger.data,
                    "output": output.getvalue(),
                    "error": str(error),
                }
            )
        except Exception as error:
            return json_size_checker(
                {
                    "executed": True,
                    "data": debugger.data,
                    "output": output.getvalue(),
                    "error": str(error),
                }
            )


def handler(event, _context):
    # handler function for AWS Lambda
    return execute(event)
