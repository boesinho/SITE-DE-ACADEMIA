const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const psicologo = sequelize.define('psicologo', {

    id_psicologo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        references: {
            model: 'usuario',
            key: 'id_usuario'
        }
    },

    nome_psicologo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            is: /^[A-Za-zÀ-ú ][A-Za-zÀ-ú ]{3,255}$/
        }
    },

    crp_psicologo: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true,
        validate: {
            is: /^[0-9]{2}\/[0-9]{5,6}$/
        }
    },

    contato_psicologo: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true,
        validate: {
            is: /^[1-9]{2}[0-9]{8,9}$/
        }
    },

    diploma_psicologo: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: []
    },

    genero_psicologo: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['MASCULINO', 'FEMININO', 'OUTRO', 'PREFIRO NÃO INFORMAR']]
        }
    },

    data_nascimento_psicologo: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
            isOldEnough(value) {
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    if (age - 1 < 21) {
                        throw new Error('Psicólogo deve ter no mínimo 21 anos');
                    }
                } else {
                    if (age < 21) {
                        throw new Error('Psicólogo deve ter no mínimo 21 anos');
                    }
                }
            }
        }
    },

    especialidade_psicologo: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        validate: {
            notEmpty(value) {
                if (!value || value.length < 1) {
                    throw new Error('É necessário informar ao menos uma especialidade.');
                }
            }
        }
    },

    foto_psicologo: {
        type: DataTypes.STRING(255),
        allowNull: true
    },

    descricao_psicologo: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    status_validacao: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'PENDENTE',
        validate: {
            isIn: [['PENDENTE', 'APROVADO', 'REPROVADO']]
        }
    },

}, {

    tableName: 'psicologo',
    timestamps: false,
    indexes: [
        {
        unique: true,
        fields: ['crp_psicologo']
        },
        {
        unique:true,
        fields:['contato_psicologo']
        }
    ]
});

module.exports = psicologo;