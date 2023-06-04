import bdb
import copy
import sys
from io import StringIO
from contextlib import redirect_stdout


class Debugger(bdb.Bdb):
    def __init__(self):
        super().__init__()
        self.is_tracing = False
        self.data = []
        self.last_line_number = -1
        self.last_variables = {}
        self.done = False

    # This function takes in a dictionary of local variables and clones them
    # into a predefined format that can be serialized into JSON data.
    def clone_locals(self, locals_dict):
        def convert_variable(value):
            match value:
                case bool():
                    return {"type": "bool", "value": value}

                case int():
                    return {"type": "int", "value": value}

                case float():
                    return {"type": "float", "value": value}

                case str():
                    return {"type": "str", "value": value}

                case dict():
                    return {
                        "type": "dict",
                        "value": {
                            child_key: convert_variable(child_value)
                            for child_key, child_value in value.items()
                        },
                    }

                case list():
                    return {
                        "type": "list",
                        "value": [
                            convert_variable(child_value) for child_value in value
                        ],
                    }

                case set():
                    return {
                        "type": "set",
                        "value": [
                            convert_variable(child_value) for child_value in value
                        ],
                    }

                case tuple():
                    return {
                        "type": "tuple",
                        "value": [
                            convert_variable(child_value) for child_value in value
                        ],
                    }

                case _:
                    return {"type": type(value).__name__, "value": value.__str__()}

        return {key: convert_variable(value) for key, value in locals_dict.items()}

    def user_line(self, frame):
        if not self.is_tracing:
            # First tiime this function is called (from the caller's frame), setup everything
            self.set_trace()
            self.is_tracing = True
            self.last_line_number = frame.f_lineno
            self.last_variables = copy.deepcopy(frame.f_locals)
            return

        if self.done:
            # Code has finished executing, any further lines are from caller's frame and should be ignored
            return

        if "__name__" in frame.f_globals and frame.f_globals["__name__"] == "bdb":
            # Code has finished executing, frame is caller's frame, hence we take frame.f_locals["locals"] instead
            variables = self.clone_locals(frame.f_locals["locals"])
            self.done = True
        else:
            variables = self.clone_locals(frame.f_locals)

        variable_changes = {}
        for var in variables:
            if (
                var in self.last_variables
                and self.last_variables[var] == variables[var]
            ):
                continue
            variable_changes[var] = variables[var]

        self.data.append(
            {"line_number": self.last_line_number, "variable_changes": variable_changes}
        )
        self.last_line_number = frame.f_lineno
        self.last_variables = variables


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
            return {
                "executed": True,
                "data": debugger.data,
                "output": output.getvalue(),
            }
        except SyntaxError as error:
            # Syntax errors will cause the code to not run at all (i.e. data and output are empty)
            return {
                "executed": False,
                "data": debugger.data,
                "output": output.getvalue(),
                "error": {"line_number": error.lineno, "message": str(error)},
            }
        except Exception as error:
            error_line_number = (
                1 if len(debugger.data) == 0 else debugger.data[-1]["line_number"]
            )
            return {
                "executed": True,
                "data": debugger.data,
                "output": output.getvalue(),
                "error": {
                    "line_number": error_line_number,
                    "message": str(error),
                },
            }


def handler(event, _context):
    # handler function for AWS Lambda
    return execute(event)
