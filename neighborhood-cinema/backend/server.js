   const express = require('express');
   const cors = require('cors');
   const sequelize = require('./config/database');
   const Movie = require('./models/Movie');
   const Ticket = require('./models/Ticket');
   const Promotion = require('./models/Promotion');
   const Loyalty = require('./models/Loyalty');

   const app = express();
   const PORT = process.env.PORT || 3000;

   app.use(cors({ origin: 'http://localhost:8080' })); // Só permite frontend local, sem remoto
   app.use(express.json());

   // Sincroniza modelos com DB (cria tabelas se não existirem)
   sequelize.sync({ force: false }).then(() => {
     console.log('Banco de dados conectado!');
   });

   // Rotas para Movies (organização de sessões)
   app.get('/api/movies', async (req, res) => {
     const movies = await Movie.findAll();
     res.json(movies);
   });

   app.post('/api/movies', async (req, res) => {
     const movie = await Movie.create(req.body);
     res.json(movie);
   });

   // Rotas para Tickets (venda/reserva de ingressos, com assentos)
   app.get('/api/tickets', async (req, res) => {
     const tickets = await Ticket.findAll({ include: Movie });
     res.json(tickets);
   });

   app.post('/api/tickets', async (req, res) => {
     const { movieId, seats, customerName, promotionId } = req.body;
     const movie = await Movie.findByPk(movieId);
     if (!movie || seats.length > movie.seatsAvailable - movie.seatsOccupied) {
       return res.status(400).json({ error: 'Assentos insuficientes!' });
     }

     // Aplica promoção se houver
     let price = 20.0;
     if (promotionId) {
       const promo = await Promotion.findByPk(promotionId);
       if (promo) price *= (1 - promo.discount);
     }

     const ticket = await Ticket.create({ movieId, seats, customerName, price, promotionId });

     // Atualiza ocupação
     await movie.update({ seatsOccupied: movie.seatsOccupied + seats.length });

     // Adiciona pontos de fidelidade (10 pontos por ingresso)
     let loyalty = await Loyalty.findOne({ where: { customerEmail: customerName + '@email.com' } }); // Simula email
     if (!loyalty) {
       loyalty = await Loyalty.create({ customerEmail: customerName + '@email.com', points: 0 });
     }
     await loyalty.update({ points: loyalty.points + (10 * seats.length) });

     res.json(ticket);
   });

   // Rotas para Promotions (promoções e fidelização)
   app.get('/api/promotions', async (req, res) => {
     const promotions = await Promotion.findAll();
     res.json(promotions);
   });

   app.post('/api/promotions', async (req, res) => {
     const promotion = await Promotion.create(req.body);
     res.json(promotion);
   });

   // Rota para Loyalty (ver/resgatar pontos)
   app.get('/api/loyalty/:email', async (req, res) => {
     const loyalty = await Loyalty.findOne({ where: { customerEmail: req.params.email } });
     res.json(loyalty || { points: 0 });
   });

   app.post('/api/loyalty/redeem', async (req, res) => {
     const { email, pointsToRedeem } = req.body;
     const loyalty = await Loyalty.findOne({ where: { customerEmail: email } });
     if (loyalty && loyalty.points >= pointsToRedeem) {
       await loyalty.update({ points: loyalty.points - pointsToRedeem });
       res.json({ success: true, remainingPoints: loyalty.points });
     } else {
       res.status(400).json({ error: 'Pontos insuficientes!' });
     }
   });

   // Rotas para Campaigns (marketing — cria promoções compartilháveis)
   app.post('/api/campaigns', async (req, res) => {
     const { name, description } = req.body;
     const promotion = await Promotion.create({ name, description, discount: 0.2 }); // 20% default para campanhas
     const shareUrl = `http://localhost:8080/index.html?promo=${promotion.id}`; // Link para compartilhar
     res.json({ promotion, shareUrl });
   });

   // Rotas para Reports (análise de público)
   app.get('/api/reports', async (req, res) => {
     const totalTickets = await Ticket.count();
     const popularMovies = await Movie.findAll({
       include: [{ model: Ticket, attributes: [] }],
       attributes: ['title', [sequelize.fn('COUNT', sequelize.col('Tickets.id')), 'ticketCount']],
       group: ['Movie.id'],
       order: [['ticketCount', 'DESC']],
       limit: 5
     });
     const peakHours = await Ticket.findAll({
       attributes: [[sequelize.fn('HOUR', sequelize.col('createdAt')), 'hour'], [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
       group: ['hour'],
       order: [['count', 'DESC']]
     });

     res.json({ totalTickets, popularMovies, peakHours });
   });

   app.listen(PORT, 'localhost', () => { // Só localhost, sem remoto
     console.log(`Servidor rodando em http://localhost:${PORT}`);
   });
   