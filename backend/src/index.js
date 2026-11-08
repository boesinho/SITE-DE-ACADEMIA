const path = require('path');

// Carrega as variáveis de ambiente do arquivo .env localizado na raiz do projeto,
// pois este arquivo index.js está dentro de backend/src.
require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
});

const express = require('express');
const cors = require('cors');
const app = express()
const port = 3000

const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./swagger/swagger');

app.get('/', (req, res) => { res.send('Olá mundo !'); })

// Permite que o front-end Vite acesse o back-end.
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

// Front-end: em desenvolvimento o React roda separado, pelo Vite (http://localhost:5173),
// e apenas consome esta API. Por isso o Express NÃO serve a pasta frontend/ — ela contém
// o código-fonte do React (JSX), que o navegador não executa.
// Em produção seria possível servir o build do front por aqui:
//   1) cd frontend && npm run build        (gera frontend/dist)
//   2) app.use(express.static(path.resolve(__dirname, '../../frontend/dist')));

const usuarioRoutes = require('./3routes/usuarioRoutes');
app.use('/usuario', usuarioRoutes);

// Documentação interativa (Swagger UI) das rotas da API.
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});


