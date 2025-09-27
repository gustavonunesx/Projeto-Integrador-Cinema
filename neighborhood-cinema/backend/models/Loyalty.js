     const { DataTypes } = require('sequelize');
     const sequelize = require('../config/database');

     const Loyalty = sequelize.define('Loyalty', {
       customerEmail: { type: DataTypes.STRING, allowNull: false, unique: true }, // email simples para rastrear pontos (sem auth)
       points: { type: DataTypes.INTEGER, defaultValue: 0 } // pontos acumulados
     });

     module.exports = Loyalty;
     