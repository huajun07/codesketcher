import pino from 'pino'
import config from './config'

const logger = pino({
	transport: {
		target: config.get('env') === 'local' ? 'pino-pretty' : 'pino/file',
	},
})

export default logger
