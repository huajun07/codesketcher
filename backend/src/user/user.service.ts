import { sequelize } from '../db/loader'
import { Code } from '../db/models'
import { BadRequest, LargePayload, NotFound, ResourceConflict } from '../errors'

const getAllCodes = async (uid: string) => {
	const codes = await Code.findAll({
		attributes: ['codename', 'code', 'input'],
		where: {
			uid,
		},
	})
	return codes
}

const USER_CODE_LIMIT = 10
const NAME_LEN_LIMIT = 100
const LEN_LIMIT = 10000

const addCode = async (
	uid: string,
	codename: string,
	code: string,
	input: string | undefined = undefined
) => {
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
	if (codename.length > NAME_LEN_LIMIT)
		throw new LargePayload('Code name exceed limit')
	const transaction = await sequelize.transaction()
	try {
		const exist = await Code.findOne({
			where: { uid, codename: name },
			transaction,
		})
		if (exist) throw new ResourceConflict('Code name already exists')
		const [affectedCount, data] = await Code.update(
			{ codename: name },
			{
				where: {
					uid,
					codename,
				},
				returning: true,
				transaction,
			}
		)
		if (affectedCount == 0) throw new NotFound()
		transaction.commit()
		return data[0]
	} catch (err) {
		transaction.rollback()
		throw err
	}
}
export { getAllCodes, addCode, deleteCode, updateCode, updateCodename }
