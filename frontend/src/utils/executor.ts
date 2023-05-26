import axios from 'axios'

interface instruction {
  line_number: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variable_changes: Record<string, any>
}

interface instructionRes {
  errorMessage: string
  instructions?: instruction[]
}

const getInstructions = async (code: string): Promise<instructionRes> => {
  const defaultErrorMessage = 'An unexpected error has occured'
  try {
    const res = await axios.post(
      process.env.REACT_APP_EXECUTOR_ENDPOINT + '/execute',
      {
        code,
      },
    )
    console.log(res)
    return {
      instructions: res.data?.data,
      errorMessage: res.data?.errorMessage || defaultErrorMessage,
    }
  } catch (err) {
    return {
      errorMessage: defaultErrorMessage,
    }
  }
}

export { getInstructions }
export type { instruction }
