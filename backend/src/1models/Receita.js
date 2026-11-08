const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// A tabela "receita" é criada por backend/src/db/01_receita.sql (não usamos sequelize.sync).
const Receita = sequelize.define('receita', {
    id_receita: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome_receita: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true
    },
    categoria: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    descricao_curta: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    ingredientes: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    modo_preparo: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tempo_preparo_min: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    calorias: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    // numeric(5,1): o driver pg devolve NUMERIC como string; o controller converte para número.
    proteina_g: {
        type: DataTypes.DECIMAL(5, 1),
        allowNull: true
    },
    // Preenchido pelo próprio banco (DEFAULT now()); a API nunca grava este campo.
    created_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'receita',
    timestamps: false
});

module.exports = Receita;
