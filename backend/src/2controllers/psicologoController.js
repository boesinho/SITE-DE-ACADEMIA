const { Usuario, Psicologo } = require('../1models');
const sequelize = require('../config/database');

const inclusaoUsuario = {
    model: Usuario,
    attributes: ['email_usuario']
};
 
async function listar(req,res){
    try{
        const psicologos = await Psicologo.findAll({ include: [inclusaoUsuario] });
        res.json(psicologos);
    }catch(erro) {
        console.error({
            nome: erro.name,
            mensagem: erro.message,
            detalhes: erro.errors ? erro.errors.map(e => ({campo: e.path, mensagem: e.message})) :undefined
        });
        res.status(500).json({ erro: erro.message });
    }
}
 
async function buscar(req,res){
    try{
        const psicologo = await Psicologo.findByPk(req.params.id, { include: [inclusaoUsuario] });
        if (!psicologo) {
            return res.status(404).json({ erro: 'Psicólogo não encontrado!'});
        }
        res.json(psicologo);
    }catch(erro) {
        console.error({
            nome: erro.name,
            mensagem: erro.message,
            detalhes: erro.errors ? erro.errors.map(e => ({campo: e.path, mensagem: e.message})) :undefined
        });
        res.status(500).json({ erro: erro.message });
    }
}

async function inserir(req,res){
    try {
        const {
            nome_psicologo,
            crp_psicologo,
            contato_psicologo,
            diploma_psicologo,
            genero_psicologo,
            data_nascimento_psicologo,
            especialidade_psicologo,
            foto_psicologo,
            descricao_psicologo,
            email_usuario,
            senha_usuario
        } = req.body;
        if (!email_usuario || !senha_usuario) {
            return res.status(400).json({ erro: 'Email e senha do usuário são obrigatórios!' });
        }
        const resultado = await sequelize.transaction(async (t) => {
            const usuarionovo = await Usuario.create({
                tipo_usuario: 'Psicologo',
                email_usuario,
                senha_usuario,
                ativo: true
            }, { transaction: t });
            const psicologonovo = await Psicologo.create({
                id_psicologo: usuarionovo.id_usuario,
                nome_psicologo,
                crp_psicologo,
                contato_psicologo,
                diploma_psicologo: diploma_psicologo || [],
                genero_psicologo,
                data_nascimento_psicologo,
                especialidade_psicologo,
                foto_psicologo,
                descricao_psicologo
            }, { transaction: t });
            return await Psicologo.findByPk(psicologonovo.id_psicologo, {
                include: [inclusaoUsuario],
                transaction: t
            });
        });
        res.status(201).json(resultado);
    }catch(erro) {
        console.error({
            nome: erro.name,
            mensagem: erro.message,
            detalhes: erro.errors ? erro.errors.map(e => ({campo: e.path, mensagem: e.message})) :undefined
        });
        res.status(500).json({ erro: erro.message });
    }
}
 
async function atualizar(req,res){
    try{
        const psicologo = await Psicologo.findByPk(req.params.id);
        if(!psicologo) {
            return res.status(404).json({ erro: 'Psicólogo não encontrado!'});
        }
        const {
            nome_psicologo,
            crp_psicologo,
            contato_psicologo,
            diploma_psicologo,
            genero_psicologo,
            data_nascimento_psicologo,
            especialidade_psicologo,
            foto_psicologo,
            descricao_psicologo
        } = req.body;
        await psicologo.update({
            nome_psicologo,
            crp_psicologo,
            contato_psicologo,
            diploma_psicologo,
            genero_psicologo,
            data_nascimento_psicologo,
            especialidade_psicologo,
            foto_psicologo,
            descricao_psicologo
        });
        res.json(psicologo);
    } catch(erro) {
        console.error({
            nome: erro.name,
            mensagem: erro.message,
            detalhes: erro.errors ? erro.errors.map(e => ({campo: e.path, mensagem: e.message})) :undefined
        });
        res.status(500).json({ erro: erro.message });
    }
}

 
async function excluir(req,res){
    try{
        const psicologo = await Psicologo.findByPk(req.params.id);
        if (!psicologo) {
            return res.status(404).json({ erro: 'Psicólogo não encontrado!' });
        }
        await psicologo.destroy();
        res.json({ mensagem: 'Psicólogo removido!'});
    } catch(erro) {
        console.error({
            nome: erro.name,
            mensagem: erro.message,
            detalhes: erro.errors ? erro.errors.map(e => ({campo: e.path, mensagem: e.message})) :undefined
        });
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