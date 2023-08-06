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

/**
 * Retrieves the stored codes of the user
 * @param uid User ID
 * @returns Records of codes associated with the user
 */
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

/**
 * Adds new code (and input) to database for the user
 * @param uid User ID
 * @param codename Name of new code to add
 * @param code New code to add
 * @param input New input to add
 * @returns Record of new code created
 * @throws Will throw an error if name is invalid, user already has too many codes stored or code/input is too large
 */
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

/**
 * Deletes the code with given name for the user
 * @param uid User ID
 * @param codename Name of code to delete
 * @throws Code does not exist
 */
const deleteCode = async (uid: string, codename: string) => {
	const deletedCnt = await Code.destroy({ where: { uid, codename } })
	if (deletedCnt == 0) throw new NotFound()
}

/**
 * Update a user's stored code
 * @param uid User ID
 * @param codename Name of code to update
 * @param code New code to update to
 * @param input New input to update to
 * @returns Record of newly updated code
 * @throws Code with given name does not exist or new code/input is too large
 */
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

/**
 * Rename an existing code of the user
 * @param uid User ID
 * @param codename Old name of code to update
 * @param name New name of code to update
 * @returns Record of newly updated code
 * @throws Code with given name does not exist or new name is invalid
 */
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
		// If reason for error is due to conflict in name (which is unique key)
		// Throw resource conflict error
		if (err instanceof Error) {
			if (err.name === SEQUELIZE_UNIQUE_ERROR) {
				throw new ResourceConflict('Code name already exists')
			}
		}
		throw err
	}
}

/**
 * Create a new share code associated with given code of the user
 * @param uid User ID
 * @param codename Name of code
 * @returns New share id of the code
 * @throws Code with given name not found or generation of id code conflict with existing ones
 */
const genShareCode = async (uid: string, codename: string) => {
	const TIMEOUT_ATTEMPTS = 40
	const code = await Code.findOne({ where: { uid, codename } })
	if (!code) throw new NotFound()
	const curId = code.shareId
	let attempts = 0
	// Continue to generate new shareId if newly generated id is
	// Same as previous one
	// Or same as a existing shareId of another code in the database

	// Note that this is unlikely to happen however this case is added in the event of a bug/vuln in the randomstring library
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
