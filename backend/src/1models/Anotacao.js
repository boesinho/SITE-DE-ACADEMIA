const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Anotacao = sequelize.define('Anotacao', {

    id_anotacao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_consulta_anotacao: {
        type: DataTypes.INTEGER
    },

    anotacao_cliente: {
        type: DataTypes.ARRAY(DataTypes.TEXT)
    },

    anotacao_psicologo: {
        type: DataTypes.ARRAY(DataTypes.TEXT)
    }

},
{
    tableName: 'anotacao',
    timestamps: false
});

module.exports = Anotacao;