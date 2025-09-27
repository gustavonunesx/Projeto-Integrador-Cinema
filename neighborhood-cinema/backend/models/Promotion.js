     const { DataTypes } = require('sequelize');
     const sequelize = require('../config/database');

     const Promotion = sequelize.define('Promotion', {
       name: { type: DataTypes.STRING, allowNull: false }, // ex: "Desconto Família"
       discount: { type: DataTypes.FLOAT, defaultValue: 0.1 }, // 10% off
       description: { type: DataTypes.TEXT } // ex: "Pacote para 4 pessoas"
     });

     module.exports = Promotion;
     