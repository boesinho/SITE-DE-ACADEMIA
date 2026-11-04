const { Consulta } = require('../1models');

async function listar(req, res) {
    try {
        const consultas = await Consulta.findAll();
        res.json(consultas);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function buscar(req, res) {
    try {
        const consulta = await Consulta.findByPk(req.params.id);
        if (!consulta) {
            return res.status(404).json({ erro: 'Consulta não encontrada!' });
        }
        res.json(consulta);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function inserir(req, res) {
    try {
        const {
            id_consulta_agendada,
            id_psicologo_responsavel,
            id_cliente_consultado,
            link_consulta,
            data_hora_consulta
        } = req.body;
        const consultanova = await Consulta.create({
            id_consulta_agendada,
            id_psicologo_responsavel,
            id_cliente_consultado,
            link_consulta,
            data_hora_consulta
        });
        res.status(201).json(consultanova);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function atualizar(req, res) {
    try {
        const consulta = await Consulta.findByPk(req.params.id);
        if (!consulta) {
            return res.status(404).json({ erro: 'Consulta não encontrada!' });
        }
        const {
            id_consulta_agendada,
            id_psicologo_responsavel,
            id_cliente_consultado,
            link_consulta,
            data_hora_consulta
        } = req.body;
        await consulta.update({
            id_consulta_agendada,
            id_psicologo_responsavel,
            id_cliente_consultado,
            link_consulta,
            data_hora_consulta
        });
        res.json(consulta);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function excluir(req, res) {
    try {
        const consulta = await Consulta.findByPk(req.params.id);
        if (!consulta) {
            return res.status(404).json({ erro: 'Consulta não encontrada!' });
        }
        await consulta.destroy();
        res.json({ mensagem: "Consulta removida!" });
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
