import request from 'supertest'
const req = request(`http://localhost:8000`)

describe('Authentication Test', () => {
	test('Get Codes', async () => {
		await req.get('/user/codes').expect(401)
	})
	test('Create Code', async () => {
		const reqBody = {
			code: "print('hello world')",
			input: '',
		}
		await req.post('/user/codes/sample').send(reqBody).expect(401)
	})
	test('Update Code', async () => {
		const reqBody = {
			code: "print('hello world')",
			input: '',
		}
		await req.put('/user/codes/sample').send(reqBody).expect(401)
	})
	test('Rename Code', async () => {
		const reqBody = {
			codename: 'sample2',
		}
		await req.put('/user/codes/sample/rename').send(reqBody).expect(401)
	})
	test('Delete Code', async () => {
		await req.delete('/user/codes/sample').expect(401)
	})
	test('Gen Share Code', async () => {
		await req.post('/user/codes/sample/share').expect(401)
	})
})
