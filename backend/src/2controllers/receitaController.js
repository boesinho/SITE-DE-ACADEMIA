const { UniqueConstraintError } = require('sequelize');
const { Receita } = require('../1models');

const CATEGORIAS = ['cafe_da_manha', 'pre_treino', 'pos_treino', 'almoco_jantar', 'lanche'];

// Maior valor que cabe numa coluna "int" do Postgres. Sem esse teto, um número gigante
// passaria na validação e estouraria no banco, virando um erro 500.
const INT_MAX = 2147483647;
// Maior valor que cabe em numeric(5,1).
const PROTEINA_MAX = 9999.9;

// ---------------------------------------------------------------------------
// Respostas de erro
// ---------------------------------------------------------------------------

// Formato único de erro: { erro: "mensagem amigável", campos?: [{ campo, mensagem }] }
function erroValidacao(res, campos) {
    return res.status(400).json({
        erro: 'Dados inválidos. Corrija os campos indicados e tente novamente.',
        campos
    });
}

function naoEncontrada(res) {
    return res.status(404).json({ erro: 'Receita não encontrada!' });
}

// 500: o cliente recebe só uma mensagem genérica (error.message pode revelar detalhes do banco).
// No log vão apenas nome, mensagem e detalhes do erro — nunca req.body, headers ou variáveis do .env.
function erroInterno(res, erro) {
    console.error({
        nome: erro.name,
        mensagem: erro.message,
        detalhes: erro.errors ? erro.errors.map(e => ({ campo: e.path, mensagem: e.message })) : undefined
    });
    return res.status(500).json({ erro: 'Erro interno do servidor. Tente novamente mais tarde.' });
}

// ---------------------------------------------------------------------------
// Validação (roda antes de qualquer consulta ao banco)
// ---------------------------------------------------------------------------

// Aceita só inteiros positivos que cabem em "int". Isso evita que /receitas/abc
// chegue ao Postgres (ele responderia com erro de sintaxe e viraria 500).
function lerId(valor) {
    if (!/^[1-9]\d{0,9}$/.test(valor)) return null;
    const id = Number(valor);
    return id <= INT_MAX ? id : null;
}

function lerTexto(origem, campo, { obrigatorio, max }, dados, erros) {
    const valor = origem[campo];

    if (valor === undefined || valor === null) {
        if (obrigatorio) erros.push({ campo, mensagem: 'Campo obrigatório.' });
        else dados[campo] = null;
        return;
    }
    if (typeof valor !== 'string') {
        erros.push({ campo, mensagem: 'Deve ser um texto.' });
        return;
    }

    // \r\n -> \n para a lista de ingredientes ter o mesmo formato venha de onde vier.
    const texto = valor.replace(/\r\n/g, '\n').trim();

    if (texto === '') {
        if (obrigatorio) erros.push({ campo, mensagem: 'Campo obrigatório.' });
        else dados[campo] = null;
        return;
    }
    // [...texto] conta caracteres (como o Postgres faz no varchar), não unidades UTF-16.
    if (max && [...texto].length > max) {
        erros.push({ campo, mensagem: `Deve ter no máximo ${max} caracteres.` });
        return;
    }
    dados[campo] = texto;
}

function lerInteiro(origem, campo, { obrigatorio, min }, dados, erros) {
    const valor = origem[campo];

    if (valor === undefined || valor === null) {
        if (obrigatorio) erros.push({ campo, mensagem: 'Campo obrigatório.' });
        else dados[campo] = null;
        return;
    }
    if (typeof valor !== 'number' || !Number.isInteger(valor) || valor < min) {
        erros.push({
            campo,
            mensagem: min > 0
                ? 'Deve ser um número inteiro maior que zero.'
                : 'Deve ser um número inteiro maior ou igual a zero.'
        });
        return;
    }
    if (valor > INT_MAX) {
        erros.push({ campo, mensagem: `Deve ser no máximo ${INT_MAX}.` });
        return;
    }
    dados[campo] = valor;
}

function lerProteina(origem, dados, erros) {
    const campo = 'proteina_g';
    const valor = origem[campo];

    if (valor === undefined || valor === null) {
        dados[campo] = null;
        return;
    }
    if (typeof valor !== 'number' || !Number.isFinite(valor) || valor < 0 || valor > PROTEINA_MAX) {
        erros.push({ campo, mensagem: `Deve ser um número entre 0 e ${PROTEINA_MAX}.` });
        return;
    }
    // A coluna guarda 1 casa decimal. Arredondar aqui garante que o valor devolvido
    // na resposta é exatamente o que o banco vai gravar.
    dados[campo] = Math.round(valor * 10) / 10;
}

// Valida o corpo do POST/PUT. Campos que não fazem parte da receita (id_receita, created_at,
// qualquer outro) são ignorados: só lemos os campos conhecidos.
function validarCorpo(body) {
    const origem = body && typeof body === 'object' && !Array.isArray(body) ? body : {};
    const dados = {};
    const erros = [];

    lerTexto(origem, 'nome_receita', { obrigatorio: true, max: 120 }, dados, erros);

    const categoria = typeof origem.categoria === 'string' ? origem.categoria.trim() : origem.categoria;
    if (categoria === undefined || categoria === null || categoria === '') {
        erros.push({ campo: 'categoria', mensagem: 'Campo obrigatório.' });
    } else if (!CATEGORIAS.includes(categoria)) {
        erros.push({ campo: 'categoria', mensagem: `Categoria inválida. Use uma destas: ${CATEGORIAS.join(', ')}.` });
    } else {
        dados.categoria = categoria;
    }

    lerTexto(origem, 'descricao_curta', { obrigatorio: false, max: 255 }, dados, erros);
    lerTexto(origem, 'ingredientes', { obrigatorio: true }, dados, erros);
    lerTexto(origem, 'modo_preparo', { obrigatorio: true }, dados, erros);
    lerInteiro(origem, 'tempo_preparo_min', { obrigatorio: true, min: 1 }, dados, erros);
    lerInteiro(origem, 'calorias', { obrigatorio: false, min: 0 }, dados, erros);
    lerProteina(origem, dados, erros);

    return { dados, erros };
}

// ---------------------------------------------------------------------------
// Resposta
// ---------------------------------------------------------------------------

// O Postgres devolve numeric como string ("32.5"). Na API, proteina_g sai como número.
function formatar(receita) {
    const dados = receita.toJSON();
    dados.proteina_g = dados.proteina_g === null || dados.proteina_g === undefined
        ? null
        : Number(dados.proteina_g);
    return dados;
}

// ---------------------------------------------------------------------------
// Rotas
// ---------------------------------------------------------------------------

async function listar(req, res) {
    try {
        const where = {};

        // ?categoria= é opcional; se vier (mesmo vazia), precisa ser uma categoria válida.
        if (req.query.categoria !== undefined) {
            const categoria = req.query.categoria;
            if (typeof categoria !== 'string' || !CATEGORIAS.includes(categoria)) {
                return erroValidacao(res, [{
                    campo: 'categoria',
                    mensagem: `Categoria inválida. Use uma destas: ${CATEGORIAS.join(', ')}.`
                }]);
            }
            where.categoria = categoria;
        }

        const receitas = await Receita.findAll({ where, order: [['id_receita', 'ASC']] });
        res.json(receitas.map(formatar));
    } catch (erro) {
        erroInterno(res, erro);
    }
}

async function buscar(req, res) {
    try {
        const id = lerId(req.params.id);
        if (id === null) {
            return erroValidacao(res, [{ campo: 'id', mensagem: 'O id deve ser um número inteiro maior que zero.' }]);
        }

        const receita = await Receita.findByPk(id);
        if (!receita) {
            return naoEncontrada(res);
        }
        res.json(formatar(receita));
    } catch (erro) {
        erroInterno(res, erro);
    }
}

async function inserir(req, res) {
    try {
        const { dados, erros } = validarCorpo(req.body);
        if (erros.length > 0) {
            return erroValidacao(res, erros);
        }

        const receitaNova = await Receita.create(dados);
        res.status(201).json(formatar(receitaNova));
    } catch (erro) {
        tratarErroDeEscrita(res, erro);
    }
}

// PUT = substituição completa: o corpo precisa trazer a receita inteira, com as mesmas
// regras do POST. Campos opcionais que não vierem são gravados como null.
async function atualizar(req, res) {
    try {
        const id = lerId(req.params.id);
        if (id === null) {
            return erroValidacao(res, [{ campo: 'id', mensagem: 'O id deve ser um número inteiro maior que zero.' }]);
        }

        const { dados, erros } = validarCorpo(req.body);
        if (erros.length > 0) {
            return erroValidacao(res, erros);
        }

        const receita = await Receita.findByPk(id);
        if (!receita) {
            return naoEncontrada(res);
        }

        await receita.update(dados);
        res.json(formatar(receita));
    } catch (erro) {
        tratarErroDeEscrita(res, erro);
    }
}

async function excluir(req, res) {
    try {
        const id = lerId(req.params.id);
        if (id === null) {
            return erroValidacao(res, [{ campo: 'id', mensagem: 'O id deve ser um número inteiro maior que zero.' }]);
        }

        const receita = await Receita.findByPk(id);
        if (!receita) {
            return naoEncontrada(res);
        }

        await receita.destroy();
        res.json({ mensagem: 'Receita removida com sucesso.' });
    } catch (erro) {
        erroInterno(res, erro);
    }
}

// Erros do POST e do PUT: nome repetido vira 409; o resto é 500 genérico.
function tratarErroDeEscrita(res, erro) {
    const nomeRepetido = erro instanceof UniqueConstraintError
        && erro.errors.some(e => e.path === 'nome_receita');

    if (nomeRepetido) {
        return res.status(409).json({
            erro: 'Já existe uma receita com esse nome.',
            campos: [{ campo: 'nome_receita', mensagem: 'Já existe uma receita com esse nome.' }]
        });
    }
    return erroInterno(res, erro);
}

module.exports = {
    listar,
    buscar,
    inserir,
    atualizar,
    excluir
};
