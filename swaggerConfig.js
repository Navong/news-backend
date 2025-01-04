const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'News API',
      version: '1.0.0',
      description: 'API documentation for the News API',
    },
    servers: [
      {
        url: 'http://newsbackend.navong.xyz', // Replace with your server URL
      },
    ],
  },
  apis: ['./index.js'], // Point to the file containing your routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
