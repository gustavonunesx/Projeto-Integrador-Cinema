const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const Ticket = require('../models/Ticket')(sequelize);
const Movie = require('../models/Movie')(sequelize);

// Analytics (acesso livre)
router.get('/', async (req, res) => {
  try {
    const topMoviesResult = await Ticket.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('Ticket.id')), 'count'],
        [sequelize.col('Movie.title'), 'title']
      ],
      include: [{
        model: Movie,
        as: 'Movie',
        attributes: [],
        required: true
      }],
      group: ['Movie.id'],
      order: [[sequelize.col('count'), 'DESC']],
      limit: 5
    });

    const topMovies = topMoviesResult.map(item => ({
      title: item.Movie.title,
      count: item.get('count')
    }));

    const peakHoursResult = await sequelize.query(
      `SELECT HOUR(purchaseDate) as hour, COUNT(id) as count 
       FROM Tickets 
       WHERE status = 'purchased' 
       GROUP BY HOUR(purchaseDate) 
       ORDER BY count DESC 
       LIMIT 5`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const peakHours = peakHoursResult.map(item => ({
      _id: item.hour,
      count: item.count
    }));

    res.json({ topMovies, peakHours });
  } catch (err) {
    res.status(500).json({ msg: 'Erro' });
  }
});

module.exports = router;
