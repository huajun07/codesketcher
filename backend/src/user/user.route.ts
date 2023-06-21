import express from 'express'
import { addCode, deleteCode, getAllCodes, updateCode } from './user.service'
import { celebrate, Joi, Segments } from 'celebrate'

const router = express()

export interface TypedRequestBody<T> extends Express.Request {
	body: T
}

interface CodeData {
	codename: string
	code: string
	input?: string
}

router.get('/codes', async (_req, res) => {
	const { uid } = res.locals
	const response = await getAllCodes(uid)
	res.status(200).json(response)
})

router.post(
	'/codes',
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			codename: Joi.string().required(),
			code: Joi.string().required(),
			input: Joi.string(),
		}),
	}),
	async (req: TypedRequestBody<CodeData>, res) => {
		const { uid } = res.locals
		const { codename, code, input } = req.body
		const response = await addCode(uid, codename, code, input)
		res.status(201).json(response)
	}
)
router.put(
	'/codes',
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			codename: Joi.string().required(),
			code: Joi.string().required(),
			input: Joi.string(),
		}),
	}),
	async (req: TypedRequestBody<CodeData>, res) => {
		const { uid } = res.locals
		const { codename, code, input } = req.body
		const response = await updateCode(uid, codename, code, input)
		res.status(200).json(response)
	}
)
router.delete(
	'/codes/:codename',
	celebrate({
		[Segments.PARAMS]: Joi.object().keys({
			codename: Joi.string().required(),
		}),
	}),
	async (req, res) => {
		const { uid } = res.locals
		const codename = req.params.codename as string
		await deleteCode(uid, codename)
		res.status(200).json({ message: 'Successful Deletion' })
	}
)

export default router
