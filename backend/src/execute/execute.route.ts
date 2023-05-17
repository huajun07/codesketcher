import express from 'express'

const router = express()

/**
 * @openapi
 * /execute:
 *   get:
 *     description: Executes the given code and returns information about variables at each step.
 *     responses:
 *       200:
 *         description: TODO - decide on format of data
 */
router.post('/execute', (_req, res) => {
	// TODO
	res.send('TODO')
})

export default router
