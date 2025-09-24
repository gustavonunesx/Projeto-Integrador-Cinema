const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { sequelize, User, Movie, Ticket, Promotion } = require('./models');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Middleware Auth JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso negado - Admin requerido' });
  next();
};

// Rotas Autenticação (já fornecidas, mas incluídas para completude)
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    if (!validator.isEmail(email) || password.length < 6) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }
    const user = await User.create({ name, email, password, role });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ user: { id: user.id, name, email, role }, token });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao registrar: ' + error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validPassword(password))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ user: { id: user.id, name: user.name, email, role }, token });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao login: ' + error.message });
  }
});

// Rotas Movies (públicas para GET, auth para CRUD)
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar filmes: ' + error.message });
  }
});

app.post('/api/movies', authenticateToken, isAdmin, async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar filme: ' + error.message });
  }
});

app.put('/api/movies/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Filme não encontrado' });
    await movie.update(req.body);
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar: ' + error.message });
  }
});

app.delete('/api/movies/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Filme não encontrado' });
    await movie.destroy();
    res.json({ message: 'Filme deletado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar: ' + error.message });
  }
});

// Rotas Promotions (auth para CRUD, pública para GET)
app.get('/api/promotions', async (req, res) => {
  try {
    const promotions = await Promotion.findAll();
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar promoções: ' + error.message });
  }
});

app.post('/api/promotions', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, discount, description, validFrom, validTo, shareLink = 'https://example.com/promotion/' + Date.now() } = req.body;
    const promotion = await Promotion.create({ name, discount, description, validFrom, validTo, shareLink });
    res.status(201).json(promotion);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar promoção: ' + error.message });
  }
});

app.put('/api/promotions/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);
    if (!promotion) return res.status(404).json({ error: 'Promoção não encontrada' });
    await promotion.update(req.body);
    res.json(promotion);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar: ' + error.message });
  }
});

app.delete('/api/promotions/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);
    if (!promotion) return res.status(404).json({ error: 'Promoção não encontrada' });
    await promotion.destroy();
    res.json({ message: 'Promoção deletada' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar: ' + error.message });
  }
});

// Rotas Tickets (auth para POST, pública para GET user's tickets)
app.get('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const tickets = await Ticket.findAll({ where: { UserId: req.user.id }, include: [Movie, Promotion] });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar ingressos: ' + error.message });
  }
});

app.post('/api/tickets', authenticateToken, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { movieId, seatNumbers, promotionId } = req.body; // seatNumbers: array [1,2]
    const userId = req.user.id;
    const movie = await Movie.findByPk(movieId);
    if (!movie) return res.status(404).json({ error: 'Filme não encontrado' });

    // Validação assentos (evita superlotação)
    const occupiedSeats = await Ticket.count({ where: { MovieId: movieId, status: 'reserved' } });
    const requestedSeats = seatNumbers.length;
    if (occupiedSeats + requestedSeats > movie.seatsAvailable) {
      return res.status(400).json({ error: 'Assentos insuficientes disponíveis' });
    }

    let discount = 0;
    let finalPrice = 20.00; // Preço base por ingresso
    if (promotionId) {
      const promotion = await Promotion.findByPk(promotionId);
      if (promotion && new Date() >= promotion.validFrom && new Date() <= promotion.validTo) {
        discount = promotion.discount;
        finalPrice = finalPrice * (1 - discount / 100);
      }
    }

    // Criar tickets (um por assento)
    const createdTickets = [];
    for (const seat of seatNumbers) {
      const ticket = await Ticket.create({
        UserId: userId,
        MovieId: movieId,
        seatNumber: seat,
        price: finalPrice,
        discountApplied: discount,
        PromotionId: promotionId || null
      }, { transaction });
      createdTickets.push(ticket);

      // Atualizar seatsAvailable
      await movie.decrement('seatsAvailable', { by: 1, transaction });
    }

    // Fidelização: +1 ponto por ticket
    await User.increment('points', { by: requestedSeats, where: { id: userId }, transaction });

    await transaction.commit();
    res.status(201).json(createdTickets);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: 'Erro na reserva: ' + error.message });
  }
});

// Rotas Reports (auth para admins/users; análises de público)
app.get('/api/reports', authenticateToken, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      // Filmes mais assistidos
      const popularMovies = await Movie.findAll({
        attributes: ['title', [sequelize.fn('COUNT', sequelize.col('Tickets.id')), 'ticketsSold']],
        include: [{ model: Ticket, attributes: [] }],
        group: ['Movie.id'],
        order: [['ticketsSold', 'DESC']],
        limit: 5
      });

      // Horários mais movimentados
      const busyTimes = await sequelize.query(
        'SELECT time, COUNT(*) as count FROM Movies m JOIN Tickets t ON m.id = t.MovieId WHERE t.status = "reserved" GROUP BY time ORDER BY count DESC LIMIT 5',
        { type: sequelize.QueryTypes.SELECT }
      );

      // Fidelização: users com mais pontos
      const loyalUsers = await User.findAll({
        attributes: ['name', 'points'],
        order: [['points', 'DESC']],
        limit: 5
      });

      res.json({ popularMovies, busyTimes, loyalUsers });
    } else {
      // Para users: seus relatórios pessoais
      const userTickets = await Ticket.count({ where: { UserId: req.user.id } });
      const userPoints = (await User.findByPk(req.user.id)).points;
      res.json({ totalTickets: userTickets, points: userPoints });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro nos relatórios: ' + error.message });
  }
});

// Sync DB e start server
sequelize.authenticate().then(() => {
  console.log('Conexão MySQL estabelecida.');
  sequelize.sync({ alter: true }).then(() => {
    console.log('Tabelas sincronizadas.');
    app.listen(PORT, () => console.log(`Server rodando em http://localhost:${PORT}`));
  });
}).catch((error) => {
  console.error('Erro na conexão MySQL:', error);
});
