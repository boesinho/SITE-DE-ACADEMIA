const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Exercicio = require('./Exercicio');
const Rotina = require('./Rotina');
const RotinaExercicio = require('./RotinaExercicio');

// Relacionamento: Usuário tem muitas rotinas / Rotina pertence a um usuário
Usuario.hasMany(Rotina, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
Rotina.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Relacionamento N para N: Rotina tem vários exercícios através de RotinaExercicio
Rotina.belongsToMany(Exercicio, { 
    through: RotinaExercicio, 
    foreignKey: 'id_rotina',
    otherKey: 'id_exercicio'
});

Exercicio.belongsToMany(Rotina, { 
    through: RotinaExercicio, 
    foreignKey: 'id_exercicio',
    otherKey: 'id_rotina'
});

// Associações diretas com a tabela intermediária (útil para consultas específicas)
RotinaExercicio.belongsTo(Rotina, { foreignKey: 'id_rotina' });
RotinaExercicio.belongsTo(Exercicio, { foreignKey: 'id_exercicio' });
Rotina.hasMany(RotinaExercicio, { foreignKey: 'id_rotina', onDelete: 'CASCADE' });
Exercicio.hasMany(RotinaExercicio, { foreignKey: 'id_exercicio', onDelete: 'CASCADE' });

module.exports = {
    sequelize,
    Usuario,
    Exercicio,
    Rotina,
    RotinaExercicio
};