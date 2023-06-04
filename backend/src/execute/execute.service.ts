import { InvokeCommand, Lambda } from '@aws-sdk/client-lambda'
import config from '../config'

const client = new Lambda({ region: config.get('executorRegion') })

export default async function execute(payload: {
	code: string
	input: string | undefined
}) {
	const command = new InvokeCommand({
		FunctionName: config.get('executorName'),
		Payload: Buffer.from(JSON.stringify(payload)),
	})
	const { Payload } = await client.send(command)
	if (Payload === undefined) {
		return null
	}
	const result = JSON.parse(Buffer.from(Payload).toString())
	return result
}
