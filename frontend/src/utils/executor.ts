import axios from 'axios'

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variable_changes: Record<string, variableValue>
}

interface instructionRes {
  errorMessage?: string
  instructions?: instruction[]
}

const getInstructions = async (code: string): Promise<instructionRes> => {
  const defaultErrorMessage = 'An unexpected error has occured'
  try {
    const res = await axios.post(
      process.env.REACT_APP_EXECUTOR_ENDPOINT + '/execute',
      {
        code,
        input: '',
      },
    )
    const ret: instructionRes = {}
    const instructions = res.data?.data
    if (instructions) ret.instructions = instructions
    if (!instructions || res.data?.error) {
      ret.errorMessage = res.data?.error || defaultErrorMessage
    }
    return ret
  } catch (err) {
    return {
      errorMessage: defaultErrorMessage,
    }
  }
}

// This cannot be defined simply as one type, because Typescript has issues
// with circular references.
type parsedVariablePrimitive = boolean | number | string
type parsedVariableArray = Array<parsedVariable>
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
