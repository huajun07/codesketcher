require('express-async-errors')
import express, { ErrorRequestHandler, Request, Response } from 'express'
import bodyParser from 'body-parser'
import pinoHttp from 'pino-http'
import serverlessExpress from '@vendia/serverless-express'
import { isCelebrateError } from 'celebrate'
import config from './config'
import logger from './logger'
import docsRouter from './docs/docs.route'
import executeRouter from './execute/execute.route'
import userRouter from './user/user.route'
import publicRoutes from './public/public.routes'
import { sequelizeLoader } from './db/loader'
import { AuthMiddleware } from './middlewares/auth.middleware'
import { HttpError } from './errors'
import cors from 'cors'

const app = express()

app.use(cors())

// Logger middleware
app.use(
	pinoHttp({
		logger: logger,
	})
)

app.use(bodyParser.json())

/**
 * API endpoints
 */
app.use(docsRouter)
app.use(executeRouter)
app.use(publicRoutes)
// All routes through /user needs user auth
app.use('/user', AuthMiddleware.isTokenAuthenticated, userRouter)

// Health Check
app.get(['/ping', '/health', '/'], (_request: Request, response: Response) => {
	return response.status(200).json({ message: 'pong' })
})

// Handles all celebrate errors (i.e. request validation error)
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

// Handles all other types of errors
const httpErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	logger.error({ message: 'sending json error response', error: err })

	if (err instanceof URIError) {
		// this error happens when someone types a malformed url such as /%c0
		res.sendStatus(400)
	}
	// If error has code and json defined, display it
	else if (err instanceof HttpError) {
		res.status(err.status).json({ message: err.message })
	} else {
		// generic error, return 500
		res.status(500).json({ message: 'Something went wrong, please try again.' })
	}
}

app.use(httpErrorHandler)

// Loads connection pool to Postgresql database
sequelizeLoader().then(() => {
	if (config.get('env') === 'local') {
		app.listen(config.get('port'), () => {
			logger.info(`App started on port ${config.get('port')}`)
		})
	}
})
exports.handler = serverlessExpress({ app })
export default app
