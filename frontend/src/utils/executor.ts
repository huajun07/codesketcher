import axios from 'axios'

interface instruction {
    line_number: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variable_changes: Record<string, any>
  }

const getInstructions = async(code: string): Promise<instruction[]> => {
    try{
        const res = await axios.post(process.env.REACT_APP_EXECUTOR_ENDPOINT + '/execute', {
            code
        })
        return res.data?.data || [] as instruction[]
    }catch(err){
        return []
    }
}

export { getInstructions }
export type { instruction }
