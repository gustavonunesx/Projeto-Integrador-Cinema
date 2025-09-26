     const { DataTypes } = require('sequelize');
     const sequelize = require('../config/database');
     const Movie = require('./Movie');

     const Ticket = sequelize.define('Ticket', {
       movieId: { type: DataTypes.INTEGER, references: { model: 'Movies', key: 'id' } },
       seats: { type: DataTypes.ARRAY(DataTypes.INTEGER) }, // array de assentos, ex: [1,2,3]
       customerName: { type: DataTypes.STRING, allowNull: false }, // nome do cliente (sem auth)
       price: { type: DataTypes.FLOAT, defaultValue: 20.0 }, // preço base
       promotionId: { type: DataTypes.INTEGER } // para aplicar promoções
     });

     Ticket.belongsTo(Movie);
     Movie.hasMany(Ticket);

     module.exports = Ticket;
     