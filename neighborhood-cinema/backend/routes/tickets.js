const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const User = require('../models/User')(sequelize);
const Movie = require('../models/Movie')(sequelize);
const Ticket = require('../models/Ticket')(sequelize);
const nodemailer = require('nodemailer');

// Reserve (cria ticket)
router.post('/reserve', async (req, res) => {
  const { userId, movieId, seats, price } = req.body;  // userId opcional
  try {
    const user = userId ? await User.findByPk(userId) : { email: 'demo@cinema.com' };  // Demo se não logado

    const ticket = await Ticket.create({
      UserId: user ? user.id : null,
      MovieId: movieId,
      seats,
      price,
      status: 'reserved'
    });

    // Atualizar movie
    const movie = await Movie.findByPk(movieId);
    if (movie) {
      movie.availableSeats = Math.max(0, movie.availableSeats - seats.length);
      await movie.save();
    }

    const populatedTicket = await Ticket.findByPk(ticket.id, {
      include: [{ model: Movie, as: 'Movie' }]
    });

    res.json(populatedTicket);
  } catch (err) {
    res.status(500).json({ msg: 'Erro' });
  }
});

// Purchase (simula, envia email, atualiza status)
router.post('/purchase/:ticketId', async (req, res) => {
  const ticketId = req.params.ticketId;
  try {
    const ticket = await Ticket.findByPk(ticketId, {
      include: [
        { model: User, as: 'User ' },
        { model: Movie, as: 'Movie' }
      ]
    });

    if (!ticket) return res.status(404).json({ msg: 'Ticket não encontrado' });

    // Simular pagamento (sem Stripe)
    ticket.status = 'purchased';
    await ticket.save();

    // Email opcional
    if (process.env.EMAIL_USER) {
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });

      const userEmail = ticket.User ? ticket.User.email : 'demo@cinema.com';
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Confirmação de Ingresso!',
        text: `Ingressos para "${ticket.Movie.title}" reservados! Total: R$ ${ticket.price}. Assentos: ${JSON.stringify(ticket.seats)}.`
      });
    }

    // Pontos loyalty (simples)
    if (ticket.User) {
      ticket.User.loyaltyPoints += 10;
      await ticket.User.save();
    }

    res.json({ msg: 'Compra simulada com sucesso!', ticket });
  } catch (err) {
    res.status(500).json({ msg: 'Erro' });
  }
});

module.exports = router;
