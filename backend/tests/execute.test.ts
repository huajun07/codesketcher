import request from 'supertest'
const req = request(`http://localhost:8000`)

describe('Execution Test', () => {
	test('Sanity Check', async () => {
		const reqBody = { code: 'a = 0' }
		const resBody = {
			executed: true,
			data: [
				{
					line_number: 1,
					local_variable_changes: {
						a: {
							type: 'int',
							value: 0,
						},
					},
					global_variable_changes: {},
					function_scope: [],
				},
			],
			output: '',
		}
		await req.post('/execute').send(reqBody).expect(200).expect(resBody)
	})
	test('Code with output', async () => {
		const reqBody = { code: "print('hi')" }
		const resBody = {
			executed: true,
			data: [
				{
					line_number: 1,
					local_variable_changes: {},
					global_variable_changes: {},
					function_scope: [],
				},
			],
			output: 'hi\n',
		}
		await req.post('/execute').send(reqBody).expect(200).expect(resBody)
	})
	test('Code with input and ouptut', async () => {
		const reqBody = {
			code: 'a = input()\nprint(a)',
			input: '123',
		}
		const resBody = {
			executed: true,
			data: [
				{
					line_number: 1,
					local_variable_changes: {
						a: {
							type: 'str',
							value: '123',
						},
					},
					global_variable_changes: {},
					function_scope: [],
				},
				{
					line_number: 2,
					local_variable_changes: {},
					global_variable_changes: {},
					function_scope: [],
				},
			],
			output: '123\n',
		}
		await req.post('/execute').send(reqBody).expect(200).expect(resBody)
	})
	test('Empty code', async () => {
		await req.post('/execute').send({ input: 'test' }).expect(422)
		await req.post('/execute').send({ code: '' }).expect(422)
	})
})
