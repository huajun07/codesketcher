import express, { ErrorRequestHandler } from 'express'
import bodyParser from 'body-parser'
import pinoHttp from 'pino-http'
import serverlessExpress from '@vendia/serverless-express'
import { isCelebrateError } from 'celebrate'
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

// handles all celebrate errors (i.e. request validation error)
const celebrateErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
	if (isCelebrateError(err)) {
		const allMessages: string[] = []
		err.details.forEach((value) => allMessages.push(value.message))
		res.status(422).json({ message: allMessages.join('\n') })
	} else {
		next(err)
	}
}
app.use(celebrateErrorHandler)

// handles all other types of errors
const httpErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	logger.error('sending json error response', err)

	if (err instanceof URIError) {
		// this error happens when someone types a malformed url such as /%c0
		res.sendStatus(400)
	} else {
		// generic error, return 500
		res.status(500).json({ message: 'Something went wrong, please try again.' })
	}
}
app.use(httpErrorHandler)

if (config.get('env') === 'local') {
	app.listen(config.get('port'), () => {
		logger.info(`App started on port ${config.get('port')}`)
	})
}

module.exports.handler = serverlessExpress({ app })
