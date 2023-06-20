// Need to register module alias here too to make db:migrate work
import 'dotenv'

import logger from '../logger'

// Config
import config from '../config'
import { SequelizeOptions } from 'sequelize-typescript/dist/sequelize/sequelize/sequelize-options'

// Constants
const DB_USERNAME = config.get('db.username')
const DB_PASSWORD = config.get('db.password')
const DB_HOST = config.get('db.host')
const DB_PORT = config.get('db.port')
const DB_NAME = config.get('db.name')
const DB_ENABLE_LOGGING = config.get('db.logging')
const DB_MIN_POOL_SIZE = config.get('db.minPoolSize')
const DB_MAX_POOL_SIZE = config.get('db.maxPoolSize')

const logDBqueries = (sql: string) => {
	if (!DB_ENABLE_LOGGING) return
	// For future parsing
	logger.info(sql)
}

const dbConfig: SequelizeOptions & {
	seederStorage: string
	seederStorageTableName: string
} = {
	database: DB_NAME,
	username: DB_USERNAME,
	password: DB_PASSWORD,
	host: DB_HOST,
	port: DB_PORT,
	dialect: 'postgres',
	dialectOptions: {
		useUTC: false, // for reading from database,
		timezone: '+08:00',
	},
	timezone: '+08:00', // for writing to database,
	define: {
		underscored: true,
		charset: 'utf8',
		// NOTE: default timestamps to false, otherwise the default values for createdAt and updatedAt won't work
		// timestamps: true,
		// deletedAt: 'deleted_at',
		// createdAt: 'created_at',
		// updatedAt: 'updated_at',
	},
	seederStorage: 'sequelize',
	seederStorageTableName: 'sequelize_seed_data',
	pool: {
		min: DB_MIN_POOL_SIZE,
		max: DB_MAX_POOL_SIZE,
	},
	logging: logDBqueries,
}

// Those variables are required by sequelize to make the `npm run db:migrate` command work.
const local = dbConfig
const test = dbConfig
const development = dbConfig
const staging = dbConfig
const production = dbConfig

export { dbConfig as default, local, test, development, staging, production }
