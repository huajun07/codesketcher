import express from 'express'
import { addCode, deleteCode, getAllCodes, updateCode } from './user.service'
import { celebrate, Joi, Segments } from 'celebrate'

const router = express()

export interface TypedRequest<P, T> extends Express.Request {
	body: T
	params: P
}

interface CodeData {
	code: string
	input?: string
}

interface CodeName {
	codename?: string
}

router.get('/codes', async (_req, res) => {
	const { uid } = res.locals
	const response = await getAllCodes(uid)
	res.status(200).json(response)
})

router.post(
	'/codes/:codename',
	celebrate({
		[Segments.PARAMS]: Joi.object().keys({
			codename: Joi.string().required(),
		}),
		[Segments.BODY]: Joi.object().keys({
			code: Joi.string().required(),
			input: Joi.string(),
		}),
	}),
	async (req: TypedRequest<CodeName, CodeData>, res) => {
		const { uid } = res.locals
		const codename = req.params.codename as string
		const { code, input } = req.body
		const response = await addCode(uid, codename, code, input)
		res.status(201).json(response)
	}
)
router.put(
	'/codes/:codename',
	celebrate({
		[Segments.PARAMS]: Joi.object().keys({
			codename: Joi.string().required(),
		}),
		[Segments.BODY]: Joi.object().keys({
			code: Joi.string().required(),
			input: Joi.string(),
		}),
	}),
	async (req: TypedRequest<CodeName, CodeData>, res) => {
		const { uid } = res.locals
		const codename = req.params.codename as string
		const { code, input } = req.body
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
	async (req: TypedRequest<CodeName, undefined>, res) => {
		const { uid } = res.locals
		const codename = req.params.codename as string
		await deleteCode(uid, codename)
		res.status(200).json({ message: 'Successful Deletion' })
	}
)

export default router
