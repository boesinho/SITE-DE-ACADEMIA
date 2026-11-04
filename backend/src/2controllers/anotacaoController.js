const { Anotacao } = require('../1models');

async function listar(req, res) {
    try {
        const anotacoes = await Anotacao.findAll();
        res.json(anotacoes);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function buscar(req, res) {
    try {
        const anotacao = await Anotacao.findByPk(req.params.id);
        if (!anotacao) return res.status(404).json({ erro: 'Anotação não encontrada!' });
        res.json(anotacao);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function inserir(req, res) {
    try {
        const {
            id_consulta_anotacao,
            anotacao_cliente,
            anotacao_psicologo
        } = req.body;
        const anotacaonova = await Anotacao.create({
            id_consulta_anotacao: req.body.id_consulta_anotacao,
            anotacao_cliente: req.body.anotacao_cliente,
            anotacao_psicologo: req.body.anotacao_psicologo
        });
        res.status(201).json(anotacaonova);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function atualizar(req, res) {
    try {
        const anotacao = await Anotacao.findByPk(req.params.id);
        if (!anotacao) {
            return res.status(404).json({ erro: 'Anotação não encontrada!' });
    } const {
        id_consulta_anotacao,
        anotacao_cliente,
        anotacao_psicologo
    } = req.body;
        await anotacao.update({
            id_consulta_anotacao,
            anotacao_cliente,
            anotacao_psicologo
        });
        res.json(anotacao);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function excluir(req, res) {
    try {
        const anotacao = await Anotacao.findByPk(req.params.id);
        if (!anotacao) {
            return res.status(404).json({ erro: 'Anotação não encontrada!' });
        }
        await anotacao.destroy();
        res.json({ mensagem: "Anotação removida!" });
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