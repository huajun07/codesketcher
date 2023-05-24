import express from 'express'
import bodyParser from 'body-parser'
import pinoHttp from 'pino-http'
import serverlessExpress from '@vendia/serverless-express'
import config from './config'
import logger from './logger'
import docsRouter from './docs/docs.route'
import executeRouter from './execute/execute.route'

const app = express()

app.use(
	pinoHttp({
		logger: logger,
	})
)
app.use(bodyParser.json())

app.use(docsRouter)
app.use(executeRouter)

if (config.get('env') === 'local') {
	app.listen(config.get('port'), () => {
		logger.info(`App started on port ${config.get('port')}`)
	})
}

module.exports.handler = serverlessExpress({ app })
