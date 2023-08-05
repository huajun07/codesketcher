import { NextFunction, Request, Response } from 'express'
import axios from 'axios'
import IdTokenVerifier from 'idtoken-verifier'
import logger from '../logger'
import config from '../config'
import { Unauthorized } from '../errors'

interface TokenData {
	sub?: string
}

export class AuthMiddleware {
	/**
	 * Validate JWT token according to google open id configuration.
	 * @param header JWT Token (Expected prepend with 'Bearer ')
	 * @returns If valid returns the user unique ID (Maximum length of 255 case-sensitive ASCII characters)
	 * @throws Token not found or invalid
	 */
	static decodeJWTHeader = async (header: string) => {
		const token = header?.split(' ')[1]
		// Ref: https://developers.google.com/identity/openid-connect/openid-connect#validatinganidtoken
		const openIDConfig = (
			await axios.get(
				'https://accounts.google.com/.well-known/openid-configuration'
			)
		).data
		const jwksURI = openIDConfig?.jwks_uri

		const verifier = new IdTokenVerifier({
			issuer: 'https://accounts.google.com',
			audience: config.get('googleClientID'),
			jwksURI,
		})
		const decoded: TokenData = await new Promise((resolve, reject) => {
			verifier.verify(token, (err, payload) => {
				if (err) return reject(err)
				resolve(payload as TokenData)
			})
		})
		if (!decoded) throw Error('Invalid JWT')
		return decoded.sub
	}

	/**
	 * Checks if request is authenticated with a valid JWT Token.
	 * If valid, retrieve the user ID from the JWT token and add it to the response local variable
	 * @param req
	 * @param res
	 * @param next
	 * @throws JWT token is not present or invalid
	 */
	static isTokenAuthenticated = (
		req: Request,
		res: Response,
		next: NextFunction
	): void => {
		const authHeader = req.headers.authorization
		if (!authHeader) next(new Unauthorized())
		else {
			this.decodeJWTHeader(authHeader)
				.then(function (uid: string | undefined) {
					if (!uid) {
						next(new Unauthorized('Bad Credentials'))
					} else {
						res.locals.uid = uid
						next()
					}
				})
				.catch((err) => {
					logger.error(err)
					next(new Unauthorized('Bad Credentials'))
				})
		}
	}
}
