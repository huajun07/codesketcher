# Executor Service

## Installing Dependencies

```bash
pip install -r requirements.txt
npm install
```

## Getting Started

This service's deployment is handled by the [Serverless](https://www.serverless.com/) framework.
To deploy to the dev/prod environments:

### Infra Dependencies

Before deploying, ensure that you have setup the following:

- An IAM role called `codesketcher-executor-lambda-no-perms` with **no permissions**. The executor lambda will take on this role, and it will not be able to touch any resources at all.
- A private subnet, whose id is stored as a SSM parameter `/codesketcher-$stage/vpc/subnet-executor-id`. The executor lambda will live in this subnet. Note that this subnet should not be connected to the Internet at all (by not routing it to an Internet Gateway).
- A security group, whose id is stored as a SSM parameter `/codesketcher-$stage/vpc/security-group-id`. Ensure that all inbound/outbound traffic are blocked.

### Deployment

- Configure your shell to use the correct IAM user as the AWS profile. You can do so by:
  - Setting the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables manually OR
  - Saving the credentials in `~/.aws/credentials` (details [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html))
- The chosen IAM user should have the appropriate permissions to deploy the required resources.
- Run `npm run deploy:dev` or `npm run deploy:prod` to deploy.

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

| Key                     | Type     | Description                                                                                                            |
| ----------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| line_number             | number   | The line number of the current code execution (first line if multiple lines)                                           |
| function_scope          | string[] | An array of function names, representing the call stack (current function is last element). Empty if not in a function |
| local_variable_changes  | Object   | -                                                                                                                      |
| global_variable_changes | Object   | -                                                                                                                      |

The `local_variable_changes` and `global_variable_changes` field will be an object, where keys are the name of the variable, and the values are objects containing `type` and `value` keys.

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
```
