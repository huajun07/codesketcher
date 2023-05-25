import { InvokeCommand, Lambda } from '@aws-sdk/client-lambda'
import config from '../config'

const client = new Lambda({ region: config.get('executorRegion') })

export default async function execute(code: string) {
	const command = new InvokeCommand({
		FunctionName: config.get('executorName'),
		Payload: Buffer.from(JSON.stringify(code)),
	})
	const { Payload } = await client.send(command)
	if (Payload === undefined) {
		return null
	}
	const result = JSON.parse(Buffer.from(Payload).toString())
	return result
}
