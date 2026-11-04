const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const agenda = sequelize.define('Agenda', {

    id_agenda: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cliente',
            key: 'id_cliente'
        }
    },

    id_psicologo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'psicologo',
            key: 'id_psicologo'
        }
    },

    datahora_agenda: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    },

    status_agenda: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['AGENDADO', 'EM_ANALISE', 'CANCELADO', 'REALIZADO']]
        }
    },

    preco_base: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },

    desconto_convenio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },

    preco_final: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },

}, {
    tableName: 'agenda',
    timestamps: false
});

module.exports = agenda;