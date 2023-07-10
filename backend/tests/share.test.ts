import { assertDBValues, seedData, truncateTable } from './utils'
import request from 'supertest'
import { sequelize, sequelizeLoader } from '../src/db/loader'
import app from '../src'
const req = request(app)

describe('Code Share Test', () => {
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
		await req
			.post('/user/codes/sample/share')
			.set('Authorization', '1')
			.expect(201)
			.then(async (res) => {
				const shareId = res.body.shareId
				await assertDBValues([
					{
						...defaultRes,
						shareId,
					},
				])
				req
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
				await assertDBValues([
					{
						...defaultRes,
						shareId,
					},
				])
				req
					.get('/codes?id=' + shareId)
					.expect(200)
					.expect(defaultReq)
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
