const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome_usuario: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email_usuario: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    senha_usuario: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    data_nascimento: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'usuario',
    timestamps: false
});

module.exports = Usuario;