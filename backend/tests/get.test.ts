import { seedData, stripUid, truncateTable } from './utils'
import request from 'supertest'
import { sequelize, sequelizeLoader } from '../src/db/loader'
import app from '../src'
const req = request(app)

describe('Code Retrival Test', () => {
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
		const data = []
		for (let i = 0; i < 9; i++) {
			const newData = {
				...defaultRes,
				codename: `sample-${i}`,
			}
			data.push(newData)
		}
		const data2 = []
		for (let i = 0; i < 10; i++) {
			const newData = {
				...defaultRes,
				codename: `sample-${i}`,
				uid: '2',
			}
			data2.push(newData)
		}
		await seedData(data.concat(data2))
		await req
			.get('/user/codes')
			.set('Authorization', '1')
			.expect(200)
			.expect(data.map((val) => stripUid(val)))
	})
})
