const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {

  id_cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  convenio_cliente: {
    type: DataTypes.STRING(10),
    allowNull: false
  },

  nome_cliente: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  cpf_cliente: {
    type: DataTypes.STRING(14),
    allowNull: false,
    unique: true
  },

  contato_cliente: {
    type: DataTypes.STRING(14),
    allowNull: true
  },

  genero_cliente: {
    type: DataTypes.STRING(20),
    allowNull: false
  },

  data_nascimento_cliente: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  descricao_cliente: {
    type: DataTypes.TEXT,
    allowNull: true
  },
},
{
    tableName: 'cliente',
    timestamps: false
});

module.exports = Cliente;