import bdb
import copy

class Debugger(bdb.Bdb):
    def __init__(self):
        super().__init__()
        self.is_tracing = False
        self.data = []
        self.last_line_number = -1
        self.last_variables = {}

    def user_line(self, frame):
        if not self.is_tracing:
            self.set_trace()
            self.is_tracing = True
            self.last_line_number = frame.f_lineno
            self.last_variables = copy.deepcopy(frame.f_locals)
        else:
            if '__name__' in frame.f_globals and frame.f_globals['__name__'] == 'bdb':
                # final stack frame belonging to the caller
                variables = copy.deepcopy(frame.f_locals['locals'])
            else:
                variables = copy.deepcopy(frame.f_locals)
            variable_changes = {}
            for var in variables:
                if var in self.last_variables and self.last_variables[var] == variables[var]:
                    continue
                variable_changes[var] = variables[var]

            self.data.append({
                'line_number': self.last_line_number,
                'variable_changes': variable_changes
            })
            self.last_line_number = frame.f_lineno
            self.last_variables = variables
            

def execute(code):
    if not isinstance(code, str):
        return {
            'ok': False,
            'error': 'Code is not a string'
        }
    
    debugger = Debugger()
    debugger.run(code, globals={}, locals={})

    return {
        'ok': True,
        'data': debugger.data
    }

# handler function for AWS Lambda
def handler(code, _context):
    return execute(code)