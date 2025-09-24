const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Movie = sequelize.define('Movie', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.STRING
    },
    genre: {
      type: DataTypes.STRING
    },
    synopsis: {
      type: DataTypes.TEXT
    },
    poster: {
      type: DataTypes.STRING
    },
    cinemaLocation: {
      type: DataTypes.STRING
    },
    totalSeats: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    },
    availableSeats: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    }
  });

  return Movie;
};
