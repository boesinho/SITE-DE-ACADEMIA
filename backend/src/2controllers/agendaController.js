const { Agenda } = require('../1models');

async function listar(req,res){
    try{
        const agendas = await Agenda.findAll();
        res.json(agendas);
    }catch(erro) {
        res.status(500).json({ erro: erro.message });
    }

}

async function buscar(req,res){
    try{
        const agenda = await Agenda.findByPk(req.params.id);
        if (!agenda) {
            return res.status(404).json({ erro: 'Agenda não encontrada!'});
        }
        res.json(agenda);
    } catch (erro) {
        res.status(500).json({erro:erro.message});
    }
}

async function inserir(req,res){
    try {
        const {
            id_cliente,
            id_psicologo,
            datahora_agenda,
            status_agenda,
            preco_base,
            desconto_convenio,
            preco_final
        } = req.body;
        const agendanova = await Agenda.create({
            id_cliente,
            id_psicologo,
            datahora_agenda,
            status_agenda,
            preco_base,
            desconto_convenio: desconto_convenio || 0,
            preco_final
        });
        res.status(201).json(agendanova);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function atualizar(req,res){
    try{
        const agenda = await Agenda.findByPk(req.params.id);
        if(!agenda) {
            return res.status(404).json({ erro: 'Agenda não encontrada!'});
        }
        const {
            id_cliente,
            id_psicologo,
            datahora_agenda,
            status_agenda,
            preco_base,
            desconto_convenio,
            preco_final
        } = req.body;
        await agenda.update({
            id_cliente,
            id_psicologo,
            datahora_agenda,
            status_agenda,
            preco_base,
            desconto_convenio: desconto_convenio || 0,
            preco_final
        });
        res.json(agenda);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function excluir(req,res){
    try{
        const agenda = await Agenda.findByPk(req.params.id);
        if (!agenda) {
            return res.status(404).json({ erro: 'Agenda não encontrada!' });
        }
        await agenda.destroy();
        res.json({ mensagem: 'Agenda removida com sucesso!'});
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