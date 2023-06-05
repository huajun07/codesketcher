import express from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import execute from './execute.service'

const router = express()

router.post(
	'/execute',
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			code: Joi.string().required(),
			input: Joi.string().allow(''),
		}),
	}),
	async (req, res) => {
		const code = req.body.code as string
		const input = req.body.input as string | undefined
		const response = await execute({ code, input })
		res.status(200).json(response)
	}
)

export default router
