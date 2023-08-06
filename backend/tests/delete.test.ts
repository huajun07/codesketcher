import { assertDBValues, seedData, truncateTable } from './utils'
import request from 'supertest'
import { sequelize, sequelizeLoader } from '../src/db/loader'
import app from '../src'
import { AuthMiddleware } from '../src/middlewares/auth.middleware'
const req = request(app)

describe('Code Delete Test', () => {
	beforeAll(async () => {
		await sequelizeLoader()
		AuthMiddleware.decodeJWTHeader = jest.fn(async (val) => val)
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
		// Check for invalid deletion although there exist files
		// With same name under different user
		// With different name under same user
		await req.delete('/user/codes/sample').set('Authorization', '2').expect(404)
		await assertDBValues(data)
	})
})
