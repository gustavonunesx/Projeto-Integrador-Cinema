   const { Sequelize } = require('sequelize');

   const sequelize = new Sequelize({
     dialect: 'sqlite',
     storage: './cinema.db', // Arquivo local, sem backups
     logging: false // Silencia logs para simplicidade
   });

   module.exports = sequelize;
   