import express from 'express'
import bodyParser from 'body-parser'
import pinoHttp from 'pino-http'
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

app.listen(config.get('port'), () => {
	logger.info(`App started on port ${config.get('port')}`)
})
