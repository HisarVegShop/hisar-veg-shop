// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
// Swagger definition
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A sample API with Swagger documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Change to your server URL
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
