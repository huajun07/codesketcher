import { assertDBValues, seedData, stripDatetime, truncateTable } from './utils'
import request from 'supertest'
import { sequelize, sequelizeLoader } from '../src/db/loader'
import app from '../src'
const req = request(app)

describe('Code Renaming Test', () => {
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
		await seedData(data)
		const resBody = {
			...defaultRes,
			codename: 'sample2-5',
		}
		await req
			.put('/user/codes/sample-5/rename')
			.set('Authorization', '1')
			.send({ codename: 'sample2-5' })
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
		await req
			.put('/user/codes/sample/rename')
			.set('Authorization', '2')
			.send({ codename: 'new' })
			.expect(404)
		await assertDBValues(data)
	})

	test('Codename already exists', async () => {
		const data = [
			defaultRes,
			{
				...defaultRes,
				codename: 'sample2',
			},
		]
		await seedData(data)
		await req
			.put('/user/codes/sample2/rename')
			.set('Authorization', '1')
			.send({
				codename: 'sample',
			})
			.expect(409)
		await assertDBValues(data)
	})

	test('Codename restrictions', async () => {
		await seedData([defaultRes])
		await req
			.put('/user/codes/sample/rename')
			.set('Authorization', '1')
			.send({
				codename: 'sample()',
			})
			.expect(400)
		await req
			.put('/user/codes/sample/rename')
			.set('Authorization', '1')
			.send({
				codename: 'a'.repeat(101),
			})
			.expect(413)
		await assertDBValues([defaultRes])
	})
})
