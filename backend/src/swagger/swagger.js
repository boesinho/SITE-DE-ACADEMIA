const usuarioSwagger = require('./usuarioSwagger');
const receitaSwagger = require('./receitaSwagger');

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

    components: {
        schemas: {
            ...receitaSwagger.components.schemas
        }
    },

    paths: {
        ...usuarioSwagger.paths,
        ...receitaSwagger.paths
    }
};

module.exports = swaggerSpec;
