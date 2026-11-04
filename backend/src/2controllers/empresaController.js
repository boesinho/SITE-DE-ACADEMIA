const { Empresa } = require('../1models');

async function listar(req, res) {
    try {
        const empresas = await Empresa.findAll();
        res.json(empresas);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function buscar(req, res) {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (!empresa) {
            return res.status(404).json({ erro: 'Empresa não encontrada!' });
        }
        res.json(empresa);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function inserir(req, res) {
    try {
        const {
            id_empresa,
            nome_empresa,
            cnpj_empresa,
            contato_empresa,
            convenio_empresa,
            nome_fantasia,
            cep_empresa,
            logo_empresa,
            descricao_empresa
        } = req.body;
        const empresanova = await Empresa.create({
            id_empresa, 
            nome_empresa,
            cnpj_empresa,
            contato_empresa,
            convenio_empresa,
            nome_fantasia,
            cep_empresa,
            logo_empresa,
            descricao_empresa
        });
        res.status(201).json(empresanova);
    } catch (erro) {
        res.status(500).json({ erro: erro.message, detalhes: erro.errors?.map(e => e.message) });
    }
}

async function atualizar(req, res) {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (!empresa) {
            return res.status(404).json({ erro: 'Empresa não encontrada!' });
        } const {
            nome_empresa,
            cnpj_empresa,
            contato_empresa,
            convenio_empresa,
            nome_fantasia,
            cep_empresa,
            logo_empresa,
            descricao_empresa
        } = req.body;
        await empresa.update({
            nome_empresa,
            cnpj_empresa,
            contato_empresa,
            convenio_empresa,
            nome_fantasia,
            cep_empresa,
            logo_empresa,
            descricao_empresa
        });
        res.json(empresa);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function excluir(req, res) {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (!empresa) {
            return res.status(404).json({ erro: 'Empresa não encontrada!' });
        }
        await empresa.destroy();
        res.json({ mensagem: "Empresa removida!" });
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