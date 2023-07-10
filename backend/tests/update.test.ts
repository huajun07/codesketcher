import { assertDBValues, seedData, stripDatetime, truncateTable } from './utils'
import request from 'supertest'
import { sequelize, sequelizeLoader } from '../src/db/loader'
import app from '../src'
import { AuthMiddleware } from '../src/middlewares/auth.middleware'
const req = request(app)

describe('Code Update Test', () => {
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
		const data = []
		for (let i = 0; i < 9; i++) {
			const newData = {
				...defaultRes,
				codename: `sample-${i}`,
			}
			data.push(newData)
		}
		await seedData(data)
		const reqBody = {
			code: 'new code',
			input: 'new input',
		}
		const resBody = {
			...defaultRes,
			...reqBody,
			codename: 'sample-5',
		}
		await req
			.put('/user/codes/sample-5')
			.set('Authorization', '1')
			.send(reqBody)
			.expect(200)
			.expect((res) => expect(stripDatetime(res.body)).toEqual(resBody))
		data[5] = resBody
		await assertDBValues(data)
	})

	test('Codename Not Found', async () => {
		const data = [
			defaultRes,
			{
				...defaultRes,
				uid: '2',
				codename: 'sample2',
			},
		]
		await seedData(data)
		const reqBody = {
			code: 'new code',
			input: 'new input',
		}
		await req
			.put('/user/codes/sample')
			.set('Authorization', '2')
			.send(reqBody)
			.expect(404)
		await assertDBValues(data)
	})

	test('Code Restrictions', async () => {
		await seedData([defaultRes])
		await req
			.put('/user/codes/sample')
			.set('Authorization', '1')
			.send({
				code: 'a'.repeat(10001),
				input: '',
			})
			.expect(413)
		await req
			.put('/user/codes/sample')
			.set('Authorization', '1')
			.send({
				code: '',
				input: 'a'.repeat(10001),
			})
			.expect(413)
		await assertDBValues([defaultRes])
	})
})
