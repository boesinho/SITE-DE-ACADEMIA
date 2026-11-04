const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const avaliacao = sequelize.define('avaliacao', {

    id_avaliacao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    avaliacao_psicologo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    estrela_avaliacao: {
        type: DataTypes.STRING(1),
        allowNull: false,
        validate: {
            isIn: [['0', '1', '2', '3', '4', '5']]
        }
    },

    texto_avaliacao: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false
    },

    avaliacao_consulta: {
        type: DataTypes.INTEGER
    }

},
{
    tableName: 'avaliacao',
    timestamps: false
});

module.exports = avaliacao;