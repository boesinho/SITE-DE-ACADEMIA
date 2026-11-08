const { Usuario } = require('../1models');

async function listar(req, res){
    try{
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    }catch(erro){
        console.error({
            nome: erro.name,
            mensagem: erro.message,
            detalhes: erro.errors ? erro.errors.map(e => ({campo: e.path, mensagem: e.message})) : undefined
        });
        res.status(500).json({erro: erro.message});
    }
}

async function buscar(req, res){
    try{
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado!' });
        }
        res.json(usuario);
    }catch(erro){
        console.error({
            nome: erro.name,
            mensagem: erro.message,
            detalhes: erro.errors ? erro.errors.map(e => ({campo: e.path, mensagem: e.message})) : undefined
        });
        res.status(500).json({erro: erro.message});
    }
}

async function inserir(req, res) {
    try {
        const {
            nome_usuario,
            email_usuario,
            senha_usuario,
            data_nascimento,
            ativo
        } = req.body;
        // TODO: a senha está sendo gravada sem hash (ver docs/pendencias.md).
        const usuarionovo = await Usuario.create({
            nome_usuario,
            email_usuario,
            senha_usuario,
            data_nascimento,
            ativo
        });
        res.status(201).json(usuarionovo);
    } catch (erro) {
        console.error({
            nome: erro.name,
            mensagem: erro.message,
            detalhes: erro.errors ? erro.errors.map(e => ({campo: e.path, mensagem: e.message})) : undefined
        });
        res.status(500).json({erro: erro.message});
    }
}

async function atualizar(req, res){
    try{
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado!' });
        }
        const {
            nome_usuario,
            email_usuario,
            senha_usuario,
            data_nascimento,
            ativo
        } = req.body;
        // TODO: a senha está sendo gravada sem hash (ver docs/pendencias.md).
        await usuario.update({
            nome_usuario,
            email_usuario,
            senha_usuario,
            data_nascimento,
            ativo
        });
        res.json(usuario);
    }catch(erro){
        console.error({
            nome: erro.name,
            mensagem: erro.message,
            detalhes: erro.errors ? erro.errors.map(e => ({campo: e.path, mensagem: e.message})) : undefined
        });
        res.status(500).json({erro: erro.message});
    }
}

async function excluir(req, res){
    try{
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado!' });
        }
        await usuario.destroy();
        res.json({ mensagem: "Usuario removido com sucesso."});
    } catch (erro) {
        console.error({
            nome: erro.name,
            mensagem: erro.message,
            detalhes: erro.errors ? erro.errors.map(e => ({campo: e.path, mensagem: e.message})) : undefined
        });
        res.status(500).json({erro: erro.message});
    }
}

module.exports = {
    listar,
    buscar,
    inserir,
    atualizar,
    excluir
};