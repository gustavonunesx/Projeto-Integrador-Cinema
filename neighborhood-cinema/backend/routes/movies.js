const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Movie = require('../models/Movie')(sequelize);

// Get all
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.findAll({ where: { availableSeats: { [Op.gt]: 0 } } });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ msg: 'Erro' });
  }
});

// Get one
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ msg: 'Não encontrado' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ msg: 'Erro' });
  }
});

// Create (qualquer um pode adicionar)
router.post('/', async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.json(movie);
  } catch (err) {
    res.status(500).json({ msg: 'Erro' });
  }
});

// Update seats
router.put('/:id/seats', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ msg: 'Não encontrado' });
    const seatsBooked = req.body.seatsBooked || 1;
    movie.availableSeats = Math.max(0, movie.availableSeats - seatsBooked);
    await movie.save();
    res.json(movie);
  } catch (err) {
    res.status(500).json({ msg: 'Erro' });
  }
});

module.exports = router;
