import 'dotenv/config'
import convict from 'convict'

convict.addFormats({
	'required-string': {
		validate: (val: string): void => {
			if (val === '') {
				throw new Error('Required value cannot be empty')
			}
		},
		coerce: (val: string | null): string | undefined => {
			if (val === null) {
				return undefined
			}
			return val
		},
	},
})

const config = convict({
	tz: {
		env: 'TZ',
		default: 'Asia/Singapore',
		format: 'required-string',
	},
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
	aws: {
		executorRegion: {
			doc: "The region hosting the executor service's Lambda",
			format: '*',
			default: 'ap-southeast-1',
			env: 'EXECUTOR_REGION',
		},
		executorName: {
			doc: "Name of the executor service's Lambda",
			format: '*',
			default: 'executor',
			env: 'EXECUTOR_NAME',
		},
		executorEndpoint: {
			doc: 'Endpoint for testing and local development',
			format: String,
			default: undefined,
			env: 'EXECUTOR_ENDPOINT',
		},
	},
	googleClientID: {
		env: 'GOOGLE_CLIENT_ID',
		default: '',
		sensitive: true,
		format: 'required-string',
	},
	db: {
		host: {
			env: 'DB_HOST',
			default: '127.0.0.1',
			sensitive: true,
			format: 'required-string',
		},
		username: {
			env: 'DB_USERNAME',
			default: 'postgres',
			sensitive: true,
			format: String,
		},
		password: {
			env: 'DB_PASSWORD',
			default: 'password',
			sensitive: true,
			format: String,
		},
		name: {
			env: 'DB_NAME',
			default: 'codesketcher',
			sensitive: true,
			format: 'required-string',
		},
		port: {
			env: 'DB_PORT',
			default: 5432,
			format: 'port',
		},
		minPoolSize: {
			env: 'DB_MIN_POOL_SIZE',
			default: 50,
		},
		maxPoolSize: {
			env: 'DB_MAX_POOL_SIZE',
			default: 200,
		},
		logging: {
			env: 'DB_ENABLE_LOGGING',
			default: false,
		},
	},
})

export default config
