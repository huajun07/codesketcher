import { assertDBValues, seedData, truncateTable } from './utils'
import request from 'supertest'
import { sequelize, sequelizeLoader } from '../src/db/loader'
import app from '../src'
import { AuthMiddleware } from '../src/middlewares/auth.middleware'
const req = request(app)

describe('Code Share Test', () => {
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
		let curId = ''
		await req
			.post('/user/codes/sample/share')
			.set('Authorization', '1')
			.expect(201)
			.then(async (res) => {
				const shareId = res.body.shareId
				curId = shareId
				await assertDBValues([
					{
						...defaultRes,
						shareId,
					},
				])
				// Check that unauth request using the share ID can successfully retrieve the code
				await req
					.get('/codes?id=' + shareId)
					.expect(200)
					.expect(defaultReq)
			})
		await req
			.post('/user/codes/sample/share')
			.set('Authorization', '1')
			.expect(201)
			.then(async (res) => {
				const shareId = res.body.shareId
				expect(shareId).not.toBe(curId)
				await assertDBValues([
					{
						...defaultRes,
						shareId,
					},
				])
				// Check that unauth request using the new share ID can successfully retrieve the code
				await req
					.get('/codes?id=' + shareId)
					.expect(200)
					.expect(defaultReq)
				// Check that old share ID is invalid
				await req.post('/codes?id=' + curId).expect(404)
			})
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
		await req
			.post('/user/codes/sample/share')
			.set('Authorization', '2')
			.expect(404)
		await assertDBValues(data)
	})

	test('ShareId Not Found', async () => {
		await seedData([defaultRes])
		await req.get('/codes?id=123').expect(404)
	})
})
