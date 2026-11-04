const { Pagamento } = require('../1models');

async function listar(req, res) {
    try {
        const pagamentos = await Pagamento.findAll();
        res.json(pagamentos);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function buscar(req, res) {
    try {
        const pagamento = await Pagamento.findByPk(req.params.id);
        if (!pagamento) {
            return res.status(404).json({ erro: 'Pagamento não encontrado!' });
        }
        res.json(pagamento);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function inserir(req, res) {
    try {
        const {
            id_agenda_pagamento,
            preco_final,
            forma_pagamento,
            situacao_pagamento
        } = req.body;
        const pagamentonovo = await Pagamento.create({
            id_agenda_pagamento,
            preco_final,
            forma_pagamento,
            situacao_pagamento
        });
        res.status(201).json(pagamentonovo);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function atualizar(req, res) {
    try {
        const pagamento = await Pagamento.findByPk(req.params.id);
        if (!pagamento) {
            return res.status(404).json({ erro: 'Pagamento não encontrado!' });
        }
        const {
            id_agenda_pagamento,
            preco_final,
            forma_pagamento,
            situacao_pagamento
        } = req.body;
        await pagamento.update({
            id_agenda_pagamento,
            preco_final,
            forma_pagamento,
            situacao_pagamento
        });
        res.json(pagamento);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function excluir(req, res) {
    try {
        const pagamento = await Pagamento.findByPk(req.params.id);
        if (!pagamento) {
            return res.status(404).json({ erro: 'Pagamento não encontrado!' });
        }
        await pagamento.destroy();
        res.json({ mensagem: "Pagamento removido!" });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

module.exports = {
    listar,
    buscar,
    inserir,
    atualizar,
    excluir
};