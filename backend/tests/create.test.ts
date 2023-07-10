import { assertDBValues, seedData, stripDatetime, truncateTable } from './utils'
import request from 'supertest'
import { sequelize, sequelizeLoader } from '../src/db/loader'
import app from '../src'
const req = request(app)

describe('Code Creation Test', () => {
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
		await req
			.post('/user/codes/sample')
			.set('Authorization', '1')
			.send(defaultReq)
			.expect(201)
			.expect((res) => expect(stripDatetime(res.body)).toEqual(defaultRes))
		await assertDBValues([defaultRes])
	})

	test('Duplicate codename', async () => {
		await seedData([defaultRes])
		const resBody = {
			...defaultRes,
			uid: '2',
		}
		await req
			.post('/user/codes/sample')
			.set('Authorization', '2')
			.send(defaultReq)
			.expect(201)
			.expect((res) => expect(stripDatetime(res.body)).toEqual(resBody))
		await req
			.post('/user/codes/sample')
			.set('Authorization', '2')
			.send(defaultReq)
			.expect(409)
		await assertDBValues([defaultRes, resBody])
	})

	test('File Limit Reached', async () => {
		const data = []
		for (let i = 0; i < 9; i++) {
			const newData = {
				...defaultRes,
				codename: `sample-${i}`,
			}
			data.push(newData)
		}
		await seedData(data)
		await req
			.post('/user/codes/sample-10')
			.set('Authorization', '1')
			.send(defaultReq)
			.expect(201)
		data.push({
			...defaultRes,
			codename: 'sample-10',
		})
		await req
			.post('/user/codes/sample11')
			.set('Authorization', '1')
			.send(defaultReq)
			.expect(400)
		await assertDBValues(data)
	})

	test('Code Restrictions', async () => {
		// Invalid characters
		await req
			.post('/user/codes/sample()')
			.set('Authorization', '1')
			.send(defaultReq)
			.expect(400)
		// Name length
		await req
			.post('/user/codes/' + 'a'.repeat(101))
			.set('Authorization', '1')
			.send(defaultReq)
			.expect(413)
		// Code length
		await req
			.post('/user/codes/sample')
			.set('Authorization', '1')
			.send({
				...defaultReq,
				code: 'a'.repeat(10001),
			})
			.expect(413)
		// Input length
		await req
			.post('/user/codes/sample')
			.set('Authorization', '1')
			.send({
				...defaultReq,
				input: 'a'.repeat(10001),
			})
			.expect(413)
		await assertDBValues([])
	})
})
