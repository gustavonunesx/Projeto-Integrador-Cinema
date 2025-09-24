const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User ');
const Movie = require('./Movie');
const Promotion = require('./Promotion');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  seatNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 100
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('reserved', 'purchased', 'cancelled'),
    defaultValue: 'reserved'
  },
  discountApplied: {
    type: DataTypes.INTEGER,  // % de desconto
    defaultValue: 0
  }
});

// Associações
Ticket.belongsTo(User);
Ticket.belongsTo(Movie);
Ticket.belongsTo(Promotion, { as: 'promotion' });

Movie.hasMany(Ticket);
User.hasMany(Ticket);
Promotion.hasMany(Ticket);

module.exports = Ticket;
