import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ChinaScape API',
      version: '1.0.0',
      description: 'REST API for the ChinaScape tourist platform',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/app/api/**/*.js'],
}

export default swaggerJsdoc(options)