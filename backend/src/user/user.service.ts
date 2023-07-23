import { sequelize } from '../db/loader'
import { Code } from '../db/models'
import {
	BadRequest,
	LargePayload,
	NotFound,
	RequestTimeout,
	ResourceConflict,
} from '../errors'
import randomstring from 'randomstring'

const getAllCodes = async (uid: string) => {
	const codes = await Code.findAll({
		attributes: ['codename', 'code', 'input', ['share_id', 'shareId']],
		where: {
			uid,
		},
		order: [['codename', 'ASC']],
	})
	return codes
}

const SEQUELIZE_UNIQUE_ERROR = 'SequelizeUniqueConstraintError'
const USER_CODE_LIMIT = 10
const NAME_LEN_LIMIT = 100
const LEN_LIMIT = 10000

const addCode = async (
	uid: string,
	codename: string,
	code: string,
	input: string | undefined = undefined
) => {
	if (codename.match(/[^a-zA-Z0-9\-._]/))
		throw new BadRequest(
			"Codename can only contain alphanumeric and '_', '.' and '-'"
		)
	if (codename.length > NAME_LEN_LIMIT)
		throw new LargePayload('Code name exceed limit')
	if (code.length > LEN_LIMIT)
		throw new LargePayload('Code length exceed limit')
	if (input && input.length > LEN_LIMIT)
		throw new LargePayload('Input length exceed limit')
	const transaction = await sequelize.transaction()
	try {
		const cnt = await Code.count({ where: { uid }, transaction })
		if (cnt >= USER_CODE_LIMIT)
			throw new BadRequest('User reached limit of saved code')
		const [data, created] = await Code.findOrCreate({
			where: { uid, codename },
			defaults: { code, input },
			transaction,
		})
		if (!created) throw new ResourceConflict('Code name already exists')
		transaction.commit()
		return data
	} catch (err) {
		transaction.rollback()
		throw err
	}
}

const deleteCode = async (uid: string, codename: string) => {
	const deletedCnt = await Code.destroy({ where: { uid, codename } })
	if (deletedCnt == 0) throw new NotFound()
}

const updateCode = async (
	uid: string,
	codename: string,
	code: string,
	input: string | undefined = undefined
) => {
	if (code.length > LEN_LIMIT)
		throw new LargePayload('Code length exceed limit')
	if (input && input.length > LEN_LIMIT)
		throw new LargePayload('Input length exceed limit')
	const [affectedCount, data] = await Code.update(
		{ code, input },
		{
			where: {
				uid,
				codename,
			},
			returning: true,
		}
	)
	if (affectedCount == 0) throw new NotFound()
	return data[0]
}

const updateCodename = async (uid: string, codename: string, name: string) => {
	if (name.match(/[^a-zA-Z0-9\-._]/))
		throw new BadRequest(
			"Codename can only contain alphanumeric and '_', '.' and '-'"
		)
	if (name.length > NAME_LEN_LIMIT)
		throw new LargePayload('Code name exceed limit')
	try {
		const [affectedCount, data] = await Code.update(
			{ codename: name },
			{
				where: {
					uid,
					codename,
				},
				returning: true,
			}
		)
		if (affectedCount == 0) throw new NotFound()
		return data[0]
	} catch (err) {
		if (err instanceof Error) {
			if (err.name === SEQUELIZE_UNIQUE_ERROR) {
				throw new ResourceConflict('Code name already exists')
			}
		}
		throw err
	}
}

const genShareCode = async (uid: string, codename: string) => {
	const TIMEOUT_ATTEMPTS = 40
	const code = await Code.findOne({ where: { uid, codename } })
	if (!code) throw new NotFound()
	const curId = code.shareId
	let attempts = 0
	while (attempts < TIMEOUT_ATTEMPTS) {
		const newId = randomstring.generate(32)
		if (newId === curId) continue
		const [affectedCount] = await Code.update(
			{ shareId: newId },
			{ where: { uid, codename } }
		)
		if (affectedCount !== 0) return { shareId: newId }
		attempts++
	}
	throw new RequestTimeout()
}

export {
	getAllCodes,
	addCode,
	deleteCode,
	updateCode,
	updateCodename,
	genShareCode,
}
