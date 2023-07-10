import { assertDBValues, seedData, truncateTable } from './utils'
import request from 'supertest'
import { sequelize, sequelizeLoader } from '../src/db/loader'
const req = request(`http://localhost:8000`)

describe('Code Delete Test', () => {
	beforeAll(async () => {
		await sequelizeLoader()
	})

	beforeEach(async () => {
		await truncateTable()
	})

	afterAll(async () => {
		await sequelize.close()
	})

	const defaultReq = {
		code: "print('hello world')",
		input: '',
	}

	const defaultRes = {
		uid: '1',
		codename: 'sample',
		...defaultReq,
		shareId: null,
	}

	test('Sanity Check', async () => {
		await seedData([defaultRes])
		await req.delete('/user/codes/sample').set('Authorization', '1').expect(200)
		await assertDBValues([])
	})

	test('Code not found', async () => {
		const data = [
			defaultRes,
			{
				...defaultRes,
				uid: '2',
				codename: 'sample2',
			},
		]
		await seedData(data)
		await req.delete('/user/codes/sample').set('Authorization', '2').expect(404)
		await assertDBValues(data)
	})
})
