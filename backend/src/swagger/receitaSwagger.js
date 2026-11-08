const CATEGORIAS = ['cafe_da_manha', 'pre_treino', 'pos_treino', 'almoco_jantar', 'lanche'];

const exemploReceita = {
    id_receita: 1,
    nome_receita: 'Panqueca de banana com aveia',
    categoria: 'pre_treino',
    descricao_curta: 'Panqueca simples de banana, ovo e aveia, boa fonte de carboidrato para comer antes do treino.',
    ingredientes: '1 banana madura média\n1 ovo\n2 colheres de sopa de aveia em flocos\n1 pitada de canela em pó',
    modo_preparo: '1. Amasse a banana.\n2. Misture o ovo e a aveia.\n3. Doure dos dois lados em frigideira antiaderente.',
    tempo_preparo_min: 15,
    calorias: 260,
    proteina_g: 10.5,
    created_at: '2026-11-08T18:30:00.000Z'
};

const exemploEntrada = {
    nome_receita: 'Panqueca de banana com aveia',
    categoria: 'pre_treino',
    descricao_curta: 'Panqueca simples de banana, ovo e aveia.',
    ingredientes: '1 banana madura média\n1 ovo\n2 colheres de sopa de aveia em flocos',
    modo_preparo: '1. Amasse a banana.\n2. Misture o ovo e a aveia.\n3. Doure dos dois lados.',
    tempo_preparo_min: 15,
    calorias: 260,
    proteina_g: 10.5
};

const parametroId = {
    name: 'id',
    in: 'path',
    required: true,
    schema: { type: 'integer', minimum: 1 },
    description: 'ID da receita',
    example: 1
};

const respostaErro = (descricao, exemplo) => ({
    description: descricao,
    content: {
        'application/json': {
            schema: { $ref: '#/components/schemas/Erro' },
            example: exemplo
        }
    }
});

const erro400 = respostaErro('Dados inválidos', {
    erro: 'Dados inválidos. Corrija os campos indicados e tente novamente.',
    campos: [
        { campo: 'nome_receita', mensagem: 'Campo obrigatório.' },
        { campo: 'tempo_preparo_min', mensagem: 'Deve ser um número inteiro maior que zero.' }
    ]
});

const erro404 = respostaErro('Receita não encontrada', { erro: 'Receita não encontrada!' });

const erro409 = respostaErro('Já existe uma receita com esse nome', {
    erro: 'Já existe uma receita com esse nome.',
    campos: [{ campo: 'nome_receita', mensagem: 'Já existe uma receita com esse nome.' }]
});

const erro500 = respostaErro('Erro interno do servidor', {
    erro: 'Erro interno do servidor. Tente novamente mais tarde.'
});

const corpoReceita = (descricao) => ({
    required: true,
    description: descricao,
    content: {
        'application/json': {
            schema: { $ref: '#/components/schemas/ReceitaEntrada' },
            example: exemploEntrada
        }
    }
});

const respostaReceita = (descricao) => ({
    description: descricao,
    content: {
        'application/json': {
            schema: { $ref: '#/components/schemas/Receita' },
            example: exemploReceita
        }
    }
});

const receitaSwagger = {
    components: {
        schemas: {
            // O que a API devolve.
            Receita: {
                type: 'object',
                properties: {
                    id_receita: { type: 'integer', example: 1 },
                    nome_receita: { type: 'string', maxLength: 120, example: 'Panqueca de banana com aveia' },
                    categoria: { type: 'string', enum: CATEGORIAS, example: 'pre_treino' },
                    descricao_curta: { type: 'string', maxLength: 255, nullable: true, example: 'Panqueca simples de banana, ovo e aveia.' },
                    ingredientes: { type: 'string', description: 'Um ingrediente por linha.', example: '1 banana madura média\n1 ovo\n2 colheres de sopa de aveia em flocos' },
                    modo_preparo: { type: 'string', example: '1. Amasse a banana.\n2. Misture o ovo e a aveia.' },
                    tempo_preparo_min: { type: 'integer', minimum: 1, example: 15 },
                    calorias: { type: 'integer', minimum: 0, nullable: true, description: 'Valor aproximado por porção.', example: 260 },
                    proteina_g: { type: 'number', minimum: 0, maximum: 9999.9, nullable: true, description: 'Valor aproximado por porção, com 1 casa decimal.', example: 10.5 },
                    created_at: { type: 'string', format: 'date-time', example: '2026-11-08T18:30:00.000Z' }
                }
            },

            // O que a API recebe no POST e no PUT.
            ReceitaEntrada: {
                type: 'object',
                required: ['nome_receita', 'categoria', 'ingredientes', 'modo_preparo', 'tempo_preparo_min'],
                properties: {
                    nome_receita: { type: 'string', maxLength: 120, example: 'Panqueca de banana com aveia' },
                    categoria: { type: 'string', enum: CATEGORIAS, example: 'pre_treino' },
                    descricao_curta: { type: 'string', maxLength: 255, nullable: true, example: 'Panqueca simples de banana, ovo e aveia.' },
                    ingredientes: { type: 'string', description: 'Um ingrediente por linha.', example: '1 banana madura média\n1 ovo\n2 colheres de sopa de aveia em flocos' },
                    modo_preparo: { type: 'string', example: '1. Amasse a banana.\n2. Misture o ovo e a aveia.' },
                    tempo_preparo_min: { type: 'integer', minimum: 1, example: 15 },
                    calorias: { type: 'integer', minimum: 0, nullable: true, example: 260 },
                    proteina_g: { type: 'number', minimum: 0, maximum: 9999.9, nullable: true, example: 10.5 }
                }
            },

            Erro: {
                type: 'object',
                required: ['erro'],
                properties: {
                    erro: { type: 'string', example: 'Dados inválidos. Corrija os campos indicados e tente novamente.' },
                    campos: {
                        type: 'array',
                        description: 'Presente em erros de validação (400) e de nome repetido (409).',
                        items: {
                            type: 'object',
                            properties: {
                                campo: { type: 'string', example: 'nome_receita' },
                                mensagem: { type: 'string', example: 'Campo obrigatório.' }
                            }
                        }
                    }
                }
            }
        }
    },

    paths: {
        '/receitas': {
            // LISTAR receitas
            get: {
                tags: ['receitas'],
                summary: 'Lista as receitas',
                description: 'Retorna todas as receitas, ordenadas por id. Use ?categoria= para filtrar.',

                parameters: [
                    {
                        name: 'categoria',
                        in: 'query',
                        required: false,
                        schema: { type: 'string', enum: CATEGORIAS },
                        description: 'Filtra por categoria. Valor fora da lista retorna 400.'
                    }
                ],

                responses: {
                    200: {
                        description: 'Lista de receitas',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/Receita' } },
                                example: [exemploReceita]
                            }
                        }
                    },
                    400: respostaErro('Categoria inválida', {
                        erro: 'Dados inválidos. Corrija os campos indicados e tente novamente.',
                        campos: [{
                            campo: 'categoria',
                            mensagem: 'Categoria inválida. Use uma destas: ' + CATEGORIAS.join(', ') + '.'
                        }]
                    }),
                    500: erro500
                }
            },

            // INSERIR receita
            post: {
                tags: ['receitas'],
                summary: 'Cadastra uma nova receita',
                requestBody: corpoReceita('Dados da nova receita'),

                responses: {
                    201: respostaReceita('Receita cadastrada com sucesso'),
                    400: erro400,
                    409: erro409,
                    500: erro500
                }
            }
        },

        '/receitas/{id}': {
            // BUSCAR receita POR ID
            get: {
                tags: ['receitas'],
                summary: 'Busca uma receita pelo ID',
                parameters: [parametroId],

                responses: {
                    200: respostaReceita('Receita encontrada'),
                    400: respostaErro('ID inválido', {
                        erro: 'Dados inválidos. Corrija os campos indicados e tente novamente.',
                        campos: [{ campo: 'id', mensagem: 'O id deve ser um número inteiro maior que zero.' }]
                    }),
                    404: erro404,
                    500: erro500
                }
            },

            // ALTERAR receita (substituição completa)
            put: {
                tags: ['receitas'],
                summary: 'Substitui uma receita por completo',
                description: 'O corpo precisa trazer a receita inteira, com as mesmas regras do POST. Campos opcionais omitidos são gravados como nulos.',
                parameters: [parametroId],
                requestBody: corpoReceita('Receita completa, que substitui a atual'),

                responses: {
                    200: respostaReceita('Receita alterada com sucesso'),
                    400: erro400,
                    404: erro404,
                    409: erro409,
                    500: erro500
                }
            },

            // EXCLUIR receita
            delete: {
                tags: ['receitas'],
                summary: 'Exclui uma receita',
                parameters: [parametroId],

                responses: {
                    200: {
                        description: 'Receita removida com sucesso',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { mensagem: { type: 'string' } }
                                },
                                example: { mensagem: 'Receita removida com sucesso.' }
                            }
                        }
                    },
                    400: respostaErro('ID inválido', {
                        erro: 'Dados inválidos. Corrija os campos indicados e tente novamente.',
                        campos: [{ campo: 'id', mensagem: 'O id deve ser um número inteiro maior que zero.' }]
                    }),
                    404: erro404,
                    500: erro500
                }
            }
        }
    }
};

module.exports = receitaSwagger;
