const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Promotion = sequelize.define('Promotion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  description: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 500]
    }
  },
  validFrom: {
    type: DataTypes.DATE,
    allowNull: false
  },
  validTo: {
    type: DataTypes.DATE,
    allowNull: false
  },
  shareLink: {  // Para marketing
    type: DataTypes.STRING,
    defaultValue: 'https://example.com/promotion/'
  }
});

module.exports = Promotion;
