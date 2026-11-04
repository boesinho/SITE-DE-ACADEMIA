const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const pagamento = sequelize.define('pagamento', {

    id_pagamento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_agenda_pagamento: {
        type: DataTypes.INTEGER
    },

    preco_final: {
        type: DataTypes.DECIMAL(10, 2)
    },

    forma_pagamento: {
        type: DataTypes.STRING(55),
        validate: {
            isIn: [['DINHEIRO', 'PIX', 'CARTAO DE CREDITO', 'CARTAO DE DEBITO', 'BOLETO', 'A PRAZO']]
        }
    },

    situacao_pagamento: {
        type: DataTypes.STRING(255),
        validate: {
            isIn: [['PAGO', 'AGUARDANDO PAGAMENTO', 'PAGO COM ATRASO', 'PAGAMENTO ATRASADO']]
        }
    }

},
{
    tableName: 'pagamento',
    timestamps: false
});

module.exports = pagamento;