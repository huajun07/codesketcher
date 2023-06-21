import { Code } from '../db/models'

export const getAllCodes = async (uid: string) => {
	const codes = await Code.findAll({
		attributes: ['codename', 'code', 'input'],
		where: {
			uid,
		},
	})
	return codes
}
