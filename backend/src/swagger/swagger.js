const usuarioSwagger = require('./usuarioSwagger');

const swaggerSpec = {
    openapi: '3.0.0',

    info: {
        title: 'API - Kaizen Gym',
        version: '1.0.0',
        description: 'Documentação da API do site Kaizen Gym'
    },

    servers: [
        {
            url: 'http://localhost:3000'
        }
    ],

    paths: {
        ...usuarioSwagger.paths
    }
};

module.exports = swaggerSpec;
