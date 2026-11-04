const express = require('express');

const router = express.Router();

const controller = require('../2controllers/clienteController');

router.get('/',controller.listar);

router.get('/:id_cliente',controller.buscar);

router.post('/',controller.inserir);

router.put('/:id_cliente',controller.atualizar);

router.delete('/:id_cliente',controller.excluir);

module.exports = router;