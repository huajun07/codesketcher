import 'dotenv/config'
import convict from 'convict'

const config = convict({
	env: {
		doc: 'The application environment.',
		format: ['production', 'development', 'local'],
		default: 'development',
		env: 'NODE_ENV',
	},
	port: {
		doc: 'The port the application binds to.',
		format: 'port',
		default: 8000,
		env: 'PORT',
	},
    executorRegion: {
        doc: 'The region hosting the executor service\'s Lambda',
        format: '*',
        default: 'us-east-1',
        env: 'EXECUTOR_REGION'
    },
    executorName: {
        doc: 'Name of the executor service\'s Lambda',
        format: '*',
        default: 'executor',
        env: 'EXECUTOR_NAME'
    }
})

export default config
