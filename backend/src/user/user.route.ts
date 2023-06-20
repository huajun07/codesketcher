import express from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import { getAllCodes } from './user.service'

const router = express()

router.get(
	'/:uid/codes',
	celebrate({
		[Segments.PARAMS]: Joi.object({
			uid: Joi.string().required(),
		}),
	}),
	async (req, res) => {
		const { uid } = req.params
		const response = await getAllCodes(uid)
		res.status(200).json(response)
	}
)

export default router
