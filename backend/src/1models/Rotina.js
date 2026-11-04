const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rotina = sequelize.define('rotina', {
    id_rotina: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nome_rotina: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'rotina',
    timestamps: false
});

module.exports = Rotina;