   const { DataTypes } = require('sequelize');
   const sequelize = require('../config/database');

   const Movie = sequelize.define('Movie', {
     title: { type: DataTypes.STRING, allowNull: false },
     genre: { type: DataTypes.STRING },
     duration: { type: DataTypes.INTEGER }, // em minutos
     showtime: { type: DataTypes.DATE }, // horário da sessão (formato completo: data + hora)
     seatsAvailable: { type: DataTypes.INTEGER, defaultValue: 50 }, // assentos totais
     seatsOccupied: { type: DataTypes.INTEGER, defaultValue: 0 }
   });

   module.exports = Movie;
   