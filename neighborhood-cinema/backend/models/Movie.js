const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const validator = require('validator');

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 500]
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 300
    }
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      is: validator.isTime  // Validação simples de horário
    }
  },
  seatsAvailable: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  image: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true
    }
  }
});

module.exports = Movie;
