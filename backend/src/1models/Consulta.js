const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const consulta = sequelize.define('consulta', {

    id_consulta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_consulta_agendada: {
        type: DataTypes.INTEGER
    },

    id_psicologo_responsavel: {
        type: DataTypes.INTEGER
    },

    id_cliente_consultado: {
        type: DataTypes.INTEGER
    },

        link_consulta: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            is: {
                args: /^https:\/\/meet\.google\.com\/[A-Za-z_.%+?=&-]{1,100}$/i,
                msg: "O link precisa ser um link válido do Google Meet"
            }
        }
    },

    data_hora_consulta: {
        type: DataTypes.DATE,
        allowNull: false
    }

},
{
    tableName: 'consulta',
    timestamps: false
});

module.exports = consulta;