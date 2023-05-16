import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CodeSketcher API',
      version: '0.0.1',
    },
  },
  apis: ['./src/*/*.route.ts'],
};
const openapiSpecification = swaggerJsdoc(options);
const router = express();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

export default router;
