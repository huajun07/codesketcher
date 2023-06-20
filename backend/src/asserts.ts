import assert from 'assert'

export function _assert_not_undefined<T>(
	value: T | undefined,
	error: string
): T {
	if (value === undefined) {
		throw new assert.AssertionError({ message: `${error} can't be undefined` })
	}
	return value
}
