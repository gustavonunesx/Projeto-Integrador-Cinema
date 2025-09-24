const sequelize = require('../config/database');
const User = require('./User ');
const Movie = require('./Movie');
const Ticket = require('./Ticket');
const Promotion = require('./Promotion');

// Associações
User.hasMany(Ticket);
Ticket.belongsTo(User);
Movie.hasMany(Ticket);
Ticket.belongsTo(Movie);
Promotion.hasMany(Ticket, { as: 'promotion' });
Ticket.belongsTo(Promotion, { as: 'promotion' });

// Sync DB (cria/atualiza tabelas no MySQL)
sequelize.sync({ alter: true }).then(() => {
  console.log('Banco de dados MySQL sincronizado.');
}).catch((error) => {
  console.error('Erro ao sincronizar DB:', error);
});

module.exports = { sequelize, User, Movie, Ticket, Promotion };
