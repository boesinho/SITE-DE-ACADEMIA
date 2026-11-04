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
            tipo_usuario,
            email_usuario,
            senha_usuario,
            ativo
        } = req.body;
        const usuarionovo = await Usuario.create({
            tipo_usuario,
            email_usuario,
            senha_usuario,
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
            tipo_usuario,
            email_usuario,
            senha_usuario,
            ativo
        } = req.body;
        await usuario.update({
            tipo_usuario,
            email_usuario,
            senha_usuario,
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