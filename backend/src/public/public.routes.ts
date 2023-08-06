import { Joi, Segments, celebrate } from 'celebrate'
import express from 'express'
import { Code } from '../db/models'
import { NotFound } from '../errors'

const router = express()

export interface TypedRequest<Q> extends Express.Request {
	query: Q
}

/**
 * Public endpoint to retrieve a user's stored code via share ID
 */
router.get(
	'/codes',
	celebrate({
		[Segments.QUERY]: Joi.object().keys({
			id: Joi.string().required(),
		}),
	}),
	async (req: TypedRequest<{ id: string }>, res) => {
		const { id } = req.query
		const response = await getCode(id)
		res.status(200).json(response)
	}
)

const getCode = async (id: string) => {
	const data = await Code.findOne({ where: { shareId: id } })
	if (!data) throw new NotFound()
	const { code, input } = data
	return { code, input }
}

export default router
