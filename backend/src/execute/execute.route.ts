import express from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import execute from './execute.service'

const router = express()

/**
 * @openapi
 * /execute:
 *   get:
 *     description: Executes the given code and returns information about variables at each step.
 *     responses:
 *       200:
 *         description: TODO - decide on format of data
 */
router.post(
	'/execute',
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			code: Joi.string().required(),
		}),
	}),
	async (req, res) => {
        const code = req.body.code as string;
		const response = await execute(code)
        res.status(200).json(response)
	}
)

export default router
