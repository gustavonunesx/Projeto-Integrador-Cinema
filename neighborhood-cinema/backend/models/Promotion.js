const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Promotion = sequelize.define('Promotion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    discount: {
      type: DataTypes.INTEGER  // Em %, ex: 20
    },
    type: {
      type: DataTypes.ENUM('discount', 'loyalty', 'package')
    },
    validFrom: {
      type: DataTypes.DATE
    },
    validTo: {
      type: DataTypes.DATE
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  return Promotion;
};
