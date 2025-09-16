// swagger.js

import swaggerAutogen from 'swagger-autogen';

// const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'https://ai-quiz-production-a28f.up.railway.app',
  basePath: "/api",
  schemes:["http"]
};

const outputFile = './swagger-output.json';

const endpointsFiles = [
  "./src/routes/server.routes.js"
];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, endpointsFiles, doc);

// const swaggerSpec = swaggerJSDoc(options);


