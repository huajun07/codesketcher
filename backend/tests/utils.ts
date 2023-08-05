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

/**
 * @returns All records in database
 */
const getAllValues = async () => {
	return (await Code.findAll()).map((val) => stripDatetime(val))
}

/**
 * Checks that all entries in the the database are identical to the provided list of values.
 * Note that this function compares the values as an unordered set
 * @param values List of values to check against
 */
const assertDBValues = async (values: CodeValues[]) => {
	const dbValues: CodeValues[] = (await getAllValues()) || []
	const comparator = (a: CodeValues, b: CodeValues) => {
		if (a.uid === b.uid) return a.codename < b.codename ? -1 : 1
		else return a.uid < b.uid ? -1 : 1
	}
	// Sort both lists of records by the primary key
	values.sort(comparator)
	dbValues.sort(comparator)

	// Check that both lists are identical
	expect(dbValues.length).toEqual(values.length)
	for (let i = 0; i < values.length; i++) {
		expect(dbValues[i]).toEqual(values[i])
	}
}

/**
 * Seed values into the database
 * @param values Values to add to the DB
 */
const seedData = async (values: CodeValues[]) => {
	await Code.bulkCreate(
		values.map((value) => {
			return { ...value }
		})
	)
}

/**
 * @param val Record of the database
 * @returns Record without the create_at and updated_at datetimes
 */
const stripDatetime = (val: Code): CodeValues => {
	const { uid, codename, code, input, shareId } = val
	return { uid, codename, code, input, shareId }
}

/**
 * @param val Record of the database stripped of datatime values
 * @returns Record without the uid
 */
const stripUid = (val: CodeValues) => {
	const { codename, code, input, shareId } = val
	return { codename, code, input, shareId }
}

export { truncateTable, assertDBValues, seedData, stripDatetime, stripUid }
