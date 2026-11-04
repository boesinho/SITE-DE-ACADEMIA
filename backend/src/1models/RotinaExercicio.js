const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RotinaExercicio = sequelize.define('rotina_exercicio', {
    id_rotina_exercicio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_rotina: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_exercicio: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    series: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    repeticoes: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descanso_segundos: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ordem: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'rotina_exercicio',
    timestamps: false
});

module.exports = RotinaExercicio;