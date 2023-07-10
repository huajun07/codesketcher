import { Code } from '../src/db/models'
const truncateTable = async () => {
	await Code.truncate()
}

interface CodeValues {
	uid: string
	codename: string
	code: string
	input?: string
	shareId?: string | null
}

const getAllValues = async () => {
	return (await Code.findAll()).map((val) => stripDatetime(val))
}

const assertDBValues = async (values: CodeValues[]) => {
	const dbValues: CodeValues[] = (await getAllValues()) || []
	const comparator = (a: CodeValues, b: CodeValues) => {
		if (a.uid === b.uid) return a.codename < b.codename ? -1 : 1
		else return a.uid < b.uid ? -1 : 1
	}
	values.sort(comparator)
	dbValues.sort(comparator)
	expect(dbValues.length).toEqual(values.length)
	for (let i = 0; i < values.length; i++) {
		expect(dbValues[i]).toEqual(values[i])
	}
}

const seedData = async (values: CodeValues[]) => {
	await Code.bulkCreate(
		values.map((value) => {
			return { ...value }
		})
	)
}

const stripDatetime = (val: Code): CodeValues => {
	const { uid, codename, code, input, shareId } = val
	return { uid, codename, code, input, shareId }
}

const stripUid = (val: CodeValues) => {
	const { codename, code, input, shareId } = val
	return { codename, code, input, shareId }
}

export { truncateTable, assertDBValues, seedData, stripDatetime, stripUid }
