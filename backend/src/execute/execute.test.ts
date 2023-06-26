import execute from './execute.service'
import client from '../aws/lambdaClient'
import logger from '../logger'

jest.mock('../aws/lambdaClient')
const mockedClient = client as jest.Mocked<typeof client>

jest.mock('../logger')
const mockedLogger = logger as jest.Mocked<typeof logger>

afterEach(() => {
	jest.clearAllMocks()
})

describe('execute service', () => {
	it('should catch lambda timeouts and return an appropriate error message', async () => {
		mockedClient.execute.mockResolvedValue({
			errorMessage: 'timestamp request-id Task timed out after 1.01 seconds',
		})
		const result = await execute({
			code: 'for i in range(1000000000):\n\tpass',
		})
		expect(result).toStrictEqual({
			executed: true,
			error: 'Execution timed out (code executed for >1 second)',
		})
	})

	it('should catch unexpected lambda errors and return an appropriate error message', async () => {
		mockedClient.execute.mockResolvedValue({
			errorMessage: 'Unhandled error message',
		})
		const result = await execute({ code: '' })
		expect(result).toStrictEqual({
			executed: false,
			error: 'An unexpected error has occured',
		})
		expect(mockedLogger.error).toBeCalled()
	})
})
