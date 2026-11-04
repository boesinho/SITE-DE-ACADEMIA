const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const empresa = sequelize.define('empresa', {

    id_empresa: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false
    },

    nome_empresa: {
        type: DataTypes.STRING(255)
    },

    cnpj_empresa: {
        type: DataTypes.STRING(14)
    },

    contato_empresa: {
        type: DataTypes.STRING(14)
    },

    convenio_empresa: {
        type: DataTypes.STRING(10)
    },

    nome_fantasia: {
        type: DataTypes.STRING(255)
    },

    cep_empresa: {
        type: DataTypes.STRING(9)
    },

    logo_empresa: {
        type: DataTypes.STRING(255)
    },

    descricao_empresa: {
        type: DataTypes.TEXT
    }

},
{
    tableName: 'empresa',
    timestamps: false
});

module.exports = empresa;