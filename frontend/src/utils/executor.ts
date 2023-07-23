import axios, { AxiosError } from 'axios'

interface boolValue {
  type: 'bool'
  value: boolean
}

interface numberValue {
  type: 'int' | 'float'
  value: number
}

interface strValue {
  type: 'str'
  value: string
}

interface dictValue {
  type: 'dict'
  value: Record<string, variableValue>
}

interface arrayValue {
  type: 'list' | 'set' | 'tuple'
  value: variableValue[]
}

interface arbitraryValue {
  type: string
  value: string
}

type variableValue =
  | boolValue
  | numberValue
  | strValue
  | dictValue
  | arrayValue
  | arbitraryValue

interface instruction {
  line_number: number
  function_scope: string[]
  local_variable_changes: Record<string, variableValue>
  global_variable_changes: Record<string, variableValue>
}

interface instructionRes {
  errorMessage?: string
  instructions?: instruction[]
  output?: string
}

const getInstructions = async (
  code: string,
  input = '',
): Promise<instructionRes> => {
  const defaultErrorMessage = 'An unexpected error has occured'
  const serverOverloadedMessage =
    'Server is overloaded, please try again in awhile ):'
  try {
    const res = await axios.post(
      process.env.REACT_APP_EXECUTOR_ENDPOINT + '/execute',
      {
        code,
        input,
      },
    )
    const ret: instructionRes = {}
    const { data: instructions, output } = res.data
    ret.output = output as string
    if (instructions) ret.instructions = instructions
    if (!instructions || res.data?.error) {
      ret.errorMessage = res.data?.error || defaultErrorMessage
    }
    return ret
  } catch (err) {
    if ((err as AxiosError).response?.status === 429)
      return {
        errorMessage: serverOverloadedMessage,
      }
    return {
      errorMessage: defaultErrorMessage,
    }
  }
}

// This cannot be defined simply as one type, because Typescript has issues
// with circular references.
type parsedVariablePrimitive = boolean | number | string
export type parsedVariableArray = Array<parsedVariable>
type parsedVariableRecord = { [key: string]: parsedVariable }
type parsedVariable =
  | parsedVariablePrimitive
  | parsedVariableArray
  | parsedVariableRecord

// parses the data returned from executor into a string or number
const parseVariableValue = (value: variableValue): parsedVariable => {
  if (typeof value.value === 'string') {
    return value.value
  }

  if (value.type === 'dict') {
    const dict: parsedVariableRecord = {}
    for (const key in value.value) {
      dict[key] = parseVariableValue(value.value[key])
    }
    return dict
  }

  if (value.type === 'list' || value.type === 'set' || value.type === 'tuple') {
    return value.value.map((element) => parseVariableValue(element))
  }

  // Type cast needed here because Typescript still thinks that
  // value.value can be a variableValue[], even though it should not.
  return value.value as number | boolean
}

export { getInstructions, parseVariableValue }
export type { instruction, parsedVariable }
