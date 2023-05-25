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
})

export default config
