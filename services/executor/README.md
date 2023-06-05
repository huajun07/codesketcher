# Executor Service

## Installing Dependencies

```bash
pip install -r requirements.txt
npm install
```

## Getting Started

To deploy to the dev/prod environments (NOTE: **Prod deployment should not be run locally**):

- Set the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables for the correct IAM user
- Run `npm run deploy:dev` or `npm run deploy:prod` to deploy

## Running Tests

```bash
pytest
```

## Executor Input Format

The executor takes in an object with the following properties:

| Key   | Type   | Required | Description                                     |
| ----- | ------ | -------- | ----------------------------------------------- |
| code  | string | yes      | The code to be executed                         |
| input | string | no       | Input to feed into stdin while executing `code` |

```json
{
    "code": "a = 1\nb = int(input())\nc = a + b\nprint(c)"
    "input": "2"
}
```

## Executor Output Format

The executor will return an object with the following properties

| Key      | Type    | Description                                                                                  |
| -------- | ------- | -------------------------------------------------------------------------------------------- |
| executed | boolean | Whether the code was executed at all. Note that this is still true if a runtime error occurs |
| output   | string  | Output captured from stdout                                                                  |
| error    | string  | An error message if the input format is wrong, or there is a syntax / runtime error          |
| data     | array   | Refer to the Variable Data section for more details                                          |

## Variable Data

Information about variables are returned in the form of variable changes in each line of code execution (to cut down size of returned data). The `data` array will contain elements of the following shape:

| Key              | Type   | Description                                                                  |
| ---------------- | ------ | ---------------------------------------------------------------------------- |
| line_number      | number | The line number of the current code execution (first line if multiple lines) |
| variable_changes | Object | -                                                                            |

The `variable_changes` field will be an object, where keys are the name of the variable, and the values are objects containing `type` and `value` keys.

The `type` will be a string representing the type of the variable, and the value is the value of the variable.

| Type               | Value                                             |
| ------------------ | ------------------------------------------------- |
| bool               | boolean                                           |
| int / float        | number                                            |
| string             | string                                            |
| dict               | object                                            |
| list / set / tuple | array                                             |
| any other types    | string (obtained from calling `object.__str__()`) |

Here is an example of what the executor might return:

```json
{
    "executed": True,
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
```
