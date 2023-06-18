import pytest
from textwrap import dedent
from executor.main import execute
from util import MatchesRegex


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
        "executed": True,
        "data": [
            {
                "line_number": 1,
                "local_variable_changes": {"a": {"type": "int", "value": 1}},
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 2,
                "local_variable_changes": {"b": {"type": "bool", "value": True}},
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 3,
                "local_variable_changes": {"c": {"type": "str", "value": "string"}},
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 4,
                "local_variable_changes": {"a": {"type": "float", "value": 1.5}},
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 5,
                "local_variable_changes": {
                    "a": {
                        "type": "list",
                        "value": [
                            {"type": "str", "value": "list"},
                            {"type": "bool", "value": False},
                            {"type": "int", "value": 123},
                        ],
                    }
                },
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 6,
                "local_variable_changes": {
                    "a": {
                        "type": "dict",
                        "value": {"key": {"type": "str", "value": "value"}},
                    }
                },
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 7,
                "local_variable_changes": {
                    "a": {
                        "type": "tuple",
                        "value": [
                            {"type": "int", "value": 1},
                            {"type": "int", "value": 2},
                            {"type": "int", "value": 3},
                        ],
                    }
                },
                "global_variable_changes": {},
                "function_scope": [],
            },
        ],
        "output": "",
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

    assert result == {
        "executed": True,
        "data": [
            {
                "line_number": 1,
                "local_variable_changes": {"a": {"type": "int", "value": 1}},
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 2,
                "local_variable_changes": {"b": {"type": "int", "value": 2}},
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 3,
                "local_variable_changes": {"c": {"type": "int", "value": 3}},
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 4,
                "local_variable_changes": {"d": {"type": "int", "value": 6}},
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 5,
                "local_variable_changes": {},
                "global_variable_changes": {},
                "function_scope": [],
            },
        ],
        "output": "Value of d is 6\n",
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
        "executed": False,
        "data": [],
        "output": "",
        "error": "unterminated string literal (detected at line 2) (<string>, line 2)",
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
        "executed": True,
        "data": [
            {
                "line_number": 1,
                "local_variable_changes": {"a": {"type": "int", "value": 1}},
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 2,
                "local_variable_changes": {},
                "global_variable_changes": {},
                "function_scope": [],
            },
        ],
        "output": "",
        "error": "division by zero",
    }


def test_json_size_limit():
    result = execute(
        {
            "code": dedent(
                """\
                    a = 0
                    for i in range(10000):
                        a += 1"""
            )
        }
    )

    assert result == {
        "executed": True,
        "error": "Too much data was generated! Please don't overload our servers ):",
    }


def test_function_without_return_statement():
    result = execute(
        {
            "code": dedent(
                """\
                    def func():
                        a = 1
                        b = 2
                    
                    func()"""
            )
        }
    )

    assert result == {
        "executed": True,
        "data": [
            {
                "line_number": 1,
                "local_variable_changes": {
                    "func": {
                        "type": "function",
                        "value": MatchesRegex("<function func at 0x[0-9a-f]*>"),
                    }
                },
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 5,
                "local_variable_changes": {},
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 2,
                "local_variable_changes": {"a": {"type": "int", "value": 1}},
                "global_variable_changes": {},
                "function_scope": ["func"],
            },
            {
                "line_number": 3,
                "local_variable_changes": {"b": {"type": "int", "value": 2}},
                "global_variable_changes": {},
                "function_scope": ["func"],
            },
        ],
        "output": "",
    }


def test_nested_functions():
    result = execute(
        {
            "code": dedent(
                """\
                    def func1():
                        a = 1
                        def func2():
                            b = 2
                            a = 2
                            def func3():
                                a = 3
                            func3()
                            a = 3
                        func2()
                        a = 1
                    
                    func1()"""
            )
        }
    )

    assert result == {
        "executed": True,
        "data": [
            {
                "line_number": 1,
                "local_variable_changes": {
                    "func1": {
                        "type": "function",
                        "value": MatchesRegex("<function func1 at 0x[0-9a-f]*>"),
                    }
                },
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 13,
                "local_variable_changes": {},
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 2,
                "local_variable_changes": {"a": {"type": "int", "value": 1}},
                "global_variable_changes": {},
                "function_scope": ["func1"],
            },
            {
                "line_number": 3,
                "local_variable_changes": {
                    "func2": {
                        "type": "function",
                        "value": MatchesRegex(
                            "<function func1.<locals>.func2 at 0x[0-9a-f]*>"
                        ),
                    }
                },
                "global_variable_changes": {},
                "function_scope": ["func1"],
            },
            {
                "line_number": 10,
                "local_variable_changes": {},
                "global_variable_changes": {},
                "function_scope": ["func1"],
            },
            {
                "line_number": 4,
                "local_variable_changes": {"b": {"type": "int", "value": 2}},
                "global_variable_changes": {},
                "function_scope": ["func1", "func2"],
            },
            {
                "line_number": 5,
                "local_variable_changes": {"a": {"type": "int", "value": 2}},
                "global_variable_changes": {},
                "function_scope": ["func1", "func2"],
            },
            {
                "line_number": 6,
                "local_variable_changes": {
                    "func3": {
                        "type": "function",
                        "value": MatchesRegex(
                            "<function func1.<locals>.func2.<locals>.func3 at 0x[0-9a-f]*>"
                        ),
                    }
                },
                "global_variable_changes": {},
                "function_scope": ["func1", "func2"],
            },
            {
                "line_number": 8,
                "local_variable_changes": {},
                "global_variable_changes": {},
                "function_scope": ["func1", "func2"],
            },
            {
                "line_number": 7,
                "local_variable_changes": {"a": {"type": "int", "value": 3}},
                "global_variable_changes": {},
                "function_scope": ["func1", "func2", "func3"],
            },
            {
                "line_number": 9,
                "local_variable_changes": {
                    "a": {"type": "int", "value": 3},
                },
                "global_variable_changes": {},
                "function_scope": ["func1", "func2"],
            },
            {
                "line_number": 11,
                "local_variable_changes": {},
                "global_variable_changes": {},
                "function_scope": ["func1"],
            },
        ],
        "output": "",
    }


def test_global_variables():
    result = execute(
        {
            "code": dedent(
                """\
                    a = 1
                    b = 1
                    def func1():
                        global a
                        a = 2
                        def func2():
                            global b
                            b = 2
                            a = 3
                        func2()
                    
                    func1()"""
            )
        }
    )

    assert result == {
        "executed": True,
        "data": [
            {
                "line_number": 1,
                "local_variable_changes": {},
                "global_variable_changes": {"a": {"type": "int", "value": 1}},
                "function_scope": [],
            },
            {
                "line_number": 2,
                "local_variable_changes": {},
                "global_variable_changes": {"b": {"type": "int", "value": 1}},
                "function_scope": [],
            },
            {
                "line_number": 3,
                "local_variable_changes": {
                    "func1": {
                        "type": "function",
                        "value": MatchesRegex("<function func1 at 0x[0-9a-f]*>"),
                    }
                },
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 12,
                "local_variable_changes": {},
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 5,
                "local_variable_changes": {},
                "global_variable_changes": {"a": {"type": "int", "value": 2}},
                "function_scope": ["func1"],
            },
            {
                "line_number": 6,
                "local_variable_changes": {
                    "func2": {
                        "type": "function",
                        "value": MatchesRegex(
                            "<function func1.<locals>.func2 at 0x[0-9a-f]*>"
                        ),
                    }
                },
                "global_variable_changes": {},
                "function_scope": ["func1"],
            },
            {
                "line_number": 10,
                "local_variable_changes": {},
                "global_variable_changes": {},
                "function_scope": ["func1"],
            },
            {
                "line_number": 8,
                "local_variable_changes": {},
                "global_variable_changes": {"b": {"type": "int", "value": 2}},
                "function_scope": ["func1", "func2"],
            },
            {
                "line_number": 9,
                "local_variable_changes": {"a": {"type": "int", "value": 3}},
                "global_variable_changes": {},
                "function_scope": ["func1", "func2"],
            },
        ],
        "output": "",
    }


def test_array_mutation():
    result = execute(
        {
            "code": dedent(
                """\
                    a = [1, [2, 3], 4]
                    a[0] = 2
                    a[1][0] = 3"""
            )
        }
    )

    assert result == {
        "executed": True,
        "data": [
            {
                "line_number": 1,
                "local_variable_changes": {
                    "a": {
                        "type": "list",
                        "value": [
                            {"type": "int", "value": 1},
                            {
                                "type": "list",
                                "value": [
                                    {"type": "int", "value": 2},
                                    {"type": "int", "value": 3},
                                ],
                            },
                            {"type": "int", "value": 4},
                        ],
                    }
                },
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 2,
                "local_variable_changes": {
                    "a": {
                        "type": "list",
                        "value": [
                            {"type": "int", "value": 2},
                            {
                                "type": "list",
                                "value": [
                                    {"type": "int", "value": 2},
                                    {"type": "int", "value": 3},
                                ],
                            },
                            {"type": "int", "value": 4},
                        ],
                    }
                },
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 3,
                "local_variable_changes": {
                    "a": {
                        "type": "list",
                        "value": [
                            {"type": "int", "value": 2},
                            {
                                "type": "list",
                                "value": [
                                    {"type": "int", "value": 3},
                                    {"type": "int", "value": 3},
                                ],
                            },
                            {"type": "int", "value": 4},
                        ],
                    }
                },
                "global_variable_changes": {},
                "function_scope": [],
            },
        ],
        "output": "",
    }


def test_dict_mutation():
    result = execute(
        {
            "code": dedent(
                """\
                    a = {'key': 123}
                    a['key'] = 456"""
            )
        }
    )

    assert result == {
        "executed": True,
        "data": [
            {
                "line_number": 1,
                "local_variable_changes": {
                    "a": {
                        "type": "dict",
                        "value": {"key": {"type": "int", "value": 123}},
                    }
                },
                "global_variable_changes": {},
                "function_scope": [],
            },
            {
                "line_number": 2,
                "local_variable_changes": {
                    "a": {
                        "type": "dict",
                        "value": {"key": {"type": "int", "value": 456}},
                    }
                },
                "global_variable_changes": {},
                "function_scope": [],
            },
        ],
        "output": "",
    }
