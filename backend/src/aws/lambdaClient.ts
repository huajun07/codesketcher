import config from '../config'
import { InvokeCommand, Lambda } from '@aws-sdk/client-lambda'

class Client {
	lambdaClient = new Lambda({ region: config.get('executorRegion') })

	async execute(functionName: string, payload: Record<string, unknown>) {
		const command = new InvokeCommand({
			FunctionName: functionName,
			Payload: Buffer.from(JSON.stringify(payload)),
		})
		const { Payload } = await this.lambdaClient.send(command)
		if (Payload === undefined) return null
		return JSON.parse(Buffer.from(Payload).toString())
	}
}

const client = new Client()

export default client
