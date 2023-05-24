import pytest
from executor.main import execute

def test_variable_declaration():
    result = execute('a = 1\nb = 2\nc = 3')
    assert result == {
        'ok': True,
        'data': [
            {
                'line_number': 1,
                'variable_changes': {'a' : 1}
            },
            {
                'line_number': 2,
                'variable_changes': {'b' : 2}
            },
            {
                'line_number': 3,
                'variable_changes': {'c' : 3}
            },
        ]
    }