import bdb
import copy
import json
import sys
from io import StringIO
from contextlib import redirect_stdout


class Debugger(bdb.Bdb):
    def __init__(self):
        # Skip modules added in AWS Lambda's runtime
        super().__init__(skip=["awslambdaric.bootstrap"])
        self.root_frame = None
        self.is_tracing = False
        self.done = False
        self.previous_line_number = -1
        self.data = []
        self.previous_function_scope = []  # e.g. ["f1", "f2"]. Empty if not in function
        self.previous_local_variables_stack = [{}]
        self.previous_global_variables = {}
        self.current_local_variables = {}
        self.current_global_variables = {}

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
                    value = variable.__str__()
            return {"type": type(variable).__name__, "value": value}

        return {key: convert_variable(value) for key, value in variables_dict.items()}

    def get_scope(self, frame):
        if frame == self.root_frame or frame == self.root_frame.f_back:
            return []
        return self.get_scope(frame.f_back) + [frame.f_code.co_name]

    def user_return(self, frame, return_value):
        # Since local variables are dropped upon returning, we need to capture them here
        if len(self.get_scope(frame)) == len(self.previous_function_scope):
            self.current_local_variables |= frame.f_locals
            self.current_global_variables |= frame.f_globals

    def user_line(self, frame):
        if not self.is_tracing:
            # First tiime this function is called (from the caller's frame), setup everything
            self.set_trace()
            self.root_frame = frame
            self.is_tracing = True
            self.previous_line_number = frame.f_lineno
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
                self.current_local_variables |= frame.f_locals["locals"]
                self.current_global_variables |= frame.f_locals["globals"]
                self.done = True
            else:
                self.current_local_variables |= frame.f_locals
                self.current_global_variables |= frame.f_globals
        self.current_global_variables.pop("__builtins__")

        local_variables_info = self.clone_variables(self.current_local_variables)
        global_variables_info = self.clone_variables(self.current_global_variables)

        local_variable_changes = {}
        global_variable_changes = {}

        previous_local_variables = self.previous_local_variables_stack[-1]
        for var in self.current_local_variables:
            if (
                var in previous_local_variables
                and previous_local_variables[var] == self.current_local_variables[var]
            ):
                continue
            local_variable_changes[var] = local_variables_info[var]

        for var in self.current_global_variables:
            if (
                var in self.previous_global_variables
                and self.previous_global_variables[var]
                == self.current_global_variables[var]
            ):
                continue
            global_variable_changes[var] = global_variables_info[var]

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
        self.previous_local_variables_stack[-1] = self.current_local_variables
        self.previous_global_variables = self.current_global_variables
        self.current_local_variables = {}
        self.current_global_variables = {}


def json_size_checker(return_data):
    json_string = json.dumps(return_data)
    if len(json_string) > 1024 * 1024:
        # json_string exceeds 1MB in length
        return {
            "executed": return_data["executed"],
            "error": "Too much data was generated! Please don't overload our servers ):",
        }
    return return_data


def execute(event):
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
            debugger.run(code, globals={}, locals={})
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
