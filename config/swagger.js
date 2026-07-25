//Swagger libraries
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

//load external document files
const bookDocs = require('../docs/books.json');
const teamDocs = require('../docs/teams.json');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'Interactive API documentation for managing contacts',
    },
    tags: [
      {
        name: 'Books',
        description: 'Operations and endpoints related to managing the book inventory'
      },
      {
        name: 'FIFA Teams',
        description: 'Operations and endpoints related to managing top national football teams'
      }
    ],
    servers: [
      {
        url: '/', 
        description: 'Current environment',
      },
    ],
    // Tell Swagger to inject your clean JSON path definitions here
    paths: {
      ...bookDocs,
      ...teamDocs 
    }
  },
  // We can leave this empty since paths are manually loaded via JSON modules above
  apis: [], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

module.exports = { setupSwagger };