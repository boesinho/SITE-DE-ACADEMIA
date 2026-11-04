const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exercicio = sequelize.define('exercicio', {
    id_exercicio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome_exercicio: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    grupo_muscular: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    equipamento: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: 'exercicio',
    timestamps: false
});

module.exports = Exercicio;