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

const pool = require('./db');
app.use(express.json());

// Informa ao Express onde estão os arquivos do front-end (HTML, CSS, JavaScript e imagens),
// buscando a pasta frontend na raiz do projeto para disponibilizá-los no navegador.
app.use(express.static(
    path.resolve(__dirname, '../../frontend')
));

const usuarioRoutes = require('./3routes/usuarioRoutes');
app.use('/usuario', usuarioRoutes);

const clienteRoutes = require('./3routes/clienteRoutes');
app.use('/cliente', clienteRoutes);

const psicologoRoutes = require('./3routes/psicologoRoutes');
app.use('/psicologo', psicologoRoutes);

const empresaRoutes = require('./3routes/empresaRoutes');
app.use('/empresa', empresaRoutes);

const agendaRoutes = require('./3routes/agendaRoutes');
app.use('/agenda', agendaRoutes);

const anotacaoRoutes = require('./3routes/anotacaoRoutes');
app.use('/anotacao', anotacaoRoutes);

const avaliacaoRoutes = require('./3routes/avaliacaoRoutes');
app.use('/avaliacao', avaliacaoRoutes);

const consultaRoutes = require('./3routes/consultaRoutes');
app.use('/consulta', consultaRoutes);

const pagamentoRoutes = require('./3routes/pagamentoRoutes');
app.use('/pagamento', pagamentoRoutes);

app.use(
    '/swagger',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});


