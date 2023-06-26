// Config
import config from '../config'

import { Sequelize } from 'sequelize-typescript'
import { Code } from './models'
import dbConfig from './config'
import logger from '../logger'
import moment from 'moment-timezone'
import { _assert_not_undefined } from '../asserts'
moment.tz.setDefault(config.get('tz'))
let sequelize: Sequelize
const sequelizeLoader = async (): Promise<Sequelize> => {
	// database, user, password, options
	sequelize = new Sequelize(
		_assert_not_undefined(dbConfig.database, 'db name'),
		_assert_not_undefined(dbConfig.username, 'db username'),
		dbConfig.password,
		dbConfig
	)

	const models = [Code]
	sequelize.addModels([...models])
	try {
		logger.info('Connecting to SQL database...')
		await sequelize.authenticate()
		logger.info('Sequelize models added')
		return sequelize
	} catch (err) {
		logger.error('SQL database connection error', err)
		process.exit(1)
	}
}

export { sequelizeLoader, sequelize }
