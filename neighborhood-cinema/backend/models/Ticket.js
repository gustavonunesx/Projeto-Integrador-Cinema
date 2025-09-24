const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ticket = sequelize.define('Ticket', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    seats: {
      type: DataTypes.JSON,  // Armazena array como JSON: ["A1", "A2"]
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('reserved', 'purchased', 'cancelled'),
      defaultValue: 'reserved'
    },
    purchaseDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  return Ticket;
};
