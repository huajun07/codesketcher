import config from '../config'
import logger from '../logger'
import client from '../aws/lambdaClient'

export default async function execute(payload: {
	code: string
	input?: string
}) {
	const result = await client.execute(config.get('executorName'), payload)
	if ('errorMessage' in result) {
		// detect if AWS Lambda threw an error
		const errorMessage = result.errorMessage as string
		if (new RegExp('Task timed out after [.0-9]* seconds').test(errorMessage)) {
			return {
				executed: true,
				error: 'Execution timed out (code executed for >1 second)',
			}
		}

		// if the error is not a timeout, then likely something went wrong
		// that requires investigation and fixing
		logger.error(
			{ awsLambdaError: result },
			'Unexpected error occured during executor lambda invocation'
		)
		return {
			executed: false,
			error: 'An unexpected error has occured',
		}
	}
	return result
}
