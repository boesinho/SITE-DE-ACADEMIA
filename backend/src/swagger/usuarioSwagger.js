const usuarioSwagger = {
    paths: {

        // LISTAR usuarios
        '/usuario': {
            get: {
                tags: ['usuario'],
                summary: 'Lista todos os usuarios',

                responses: {
                    200: {
                        description: 'Lista de usuarios retornada com sucesso'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // INSERIR usuario
            post: {
                tags: ['usuario'],
                summary: 'Cadastra um novo usuario',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    tipo_usuario: {
                                        type: 'string',
                                        enum: ['Cliente', 'Psicologo', 'Empresa'],
                                        example: 'Cliente'
                                    },
                                    email_usuario: {
                                        type: 'string',
                                        example: 'joao.silva@teste.com'
                                    },
                                    senha_usuario: {
                                        type: 'string',
                                        example: 'senha123'
                                    },
                                    ativo: {
                                        type: 'boolean',
                                        example: true
                                    }
                                },

                                required: ['tipo_usuario', 'email_usuario', 'senha_usuario']
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: 'Usuario cadastrado com sucesso'
                    },

                    400: {
                        description: 'Dados inválidos'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        // BUSCAR usuario POR ID
        '/usuario/{id}': {

            get: {
                tags: ['usuario'],
                summary: 'Busca um usuario pelo ID',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do usuario'
                    }
                ],

                responses: {
                    200: {
                        description: 'Usuario encontrado'
                    },

                    404: {
                        description: 'Usuario não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // ALTERAR usuario
            put: {
                tags: ['usuario'],
                summary: 'Altera um usuario',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do usuario'
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    tipo_usuario: {
                                        type: 'string',
                                        enum: ['Cliente', 'Psicologo', 'Empresa'],
                                        example: 'Cliente'
                                    },
                                    email_usuario: {
                                        type: 'string',
                                        example: 'joao.silva@teste.com'
                                    },
                                    senha_usuario: {
                                        type: 'string',
                                        example: 'senha123'
                                    },
                                    ativo: {
                                        type: 'boolean',
                                        example: true
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: 'Usuario alterado com sucesso'
                    },

                    404: {
                        description: 'Usuario não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // EXCLUIR usuario
            delete: {
                tags: ['usuario'],
                summary: 'Exclui um usuario',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do usuario'
                    }
                ],

                responses: {
                    200: {
                        description: 'Usuario excluído com sucesso'
                    },

                    404: {
                        description: 'Usuario não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        }
    }
};

module.exports = usuarioSwagger;