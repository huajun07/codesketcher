import pytest
from textwrap import dedent
from executor.main import execute


def test_variable_declaration():
    result = execute(
        {
            "code": dedent(
                """\
            a = 1
            b = True
            c = 'string'
            a = 1.5
            a = ['list', False, 123]
            a = {'key': 'value'}
            a = (1, 2, 3)"""
            )
        }
    )

    assert result == {
        "ok": True,
        "output": "",
        "data": [
            {"line_number": 1, "variable_changes": {"a": {"type": "int", "value": 1}}},
            {
                "line_number": 2,
                "variable_changes": {"b": {"type": "bool", "value": True}},
            },
            {
                "line_number": 3,
                "variable_changes": {"c": {"type": "str", "value": "string"}},
            },
            {
                "line_number": 4,
                "variable_changes": {"a": {"type": "float", "value": 1.5}},
            },
            {
                "line_number": 5,
                "variable_changes": {
                    "a": {
                        "type": "list",
                        "value": [
                            {"type": "str", "value": "list"},
                            {"type": "bool", "value": False},
                            {"type": "int", "value": 123},
                        ],
                    }
                },
            },
            {
                "line_number": 6,
                "variable_changes": {
                    "a": {
                        "type": "dict",
                        "value": {"key": {"type": "str", "value": "value"}},
                    }
                },
            },
            {
                "line_number": 7,
                "variable_changes": {
                    "a": {
                        "type": "tuple",
                        "value": [
                            {"type": "int", "value": 1},
                            {"type": "int", "value": 2},
                            {"type": "int", "value": 3},
                        ],
                    }
                },
            },
        ],
    }


def test_input_output():
    result = execute(
        {
            "code": dedent(
                """\
                a = 1
                b = int(input())
                c = int(input())
                d = a + b + c
                print(f'Value of d is {d}')"""
            ),
            "input": dedent(
                """\
                2
                3
                Extra input is ignored"""
            ),
        }
    )

    print(result)
    assert result == {
        "ok": True,
        "output": "Value of d is 6\n",
        "data": [
            {"line_number": 1, "variable_changes": {"a": {"type": "int", "value": 1}}},
            {"line_number": 2, "variable_changes": {"b": {"type": "int", "value": 2}}},
            {"line_number": 3, "variable_changes": {"c": {"type": "int", "value": 3}}},
            {"line_number": 4, "variable_changes": {"d": {"type": "int", "value": 6}}},
            {"line_number": 5, "variable_changes": {}},
        ],
    }


def test_syntax_error():
    result = execute(
        {
            "code": dedent(
                """\
            a = 123
            b = '
            c = 123"""
            )
        }
    )

    assert result == {
        "ok": False,
        "data": [],
        "output": "",
        "error": {
            "line_number": 2,
            "message": "unterminated string literal (detected at line 2) (<string>, line 2)",
        },
    }


def test_divide_by_zero_exception():
    result = execute(
        {
            "code": dedent(
                """\
            a = 1
            b = a / 0
            c = 1"""
            )
        }
    )

    assert result == {
        "ok": True,
        "data": [
            {"line_number": 1, "variable_changes": {"a": {"type": "int", "value": 1}}},
            {"line_number": 2, "variable_changes": {}},
        ],
        "output": "",
        "error": {"line_number": 2, "message": "division by zero"},
    }
