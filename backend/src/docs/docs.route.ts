import express from 'express'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import YAML from 'yaml'

const file = fs.readFileSync('./swagger.yml', 'utf8')
const swaggerDocument = YAML.parse(file)
const router = express()

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

export default router
