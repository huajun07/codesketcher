import config from '../config'
import { InvokeCommand, Lambda } from '@aws-sdk/client-lambda'

class Client {
	// Note that the executorEndpoint is used in local/testing env to query the executor docker image
	// In dev/prod this field will be undefined and thus default to the aws cloud server
	lambdaClient = new Lambda({
		endpoint: config.get('aws.executorEndpoint'),
		region: config.get('aws.executorRegion'),
	})

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
