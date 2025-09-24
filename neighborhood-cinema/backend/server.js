const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sequelize
const sequelize = require('./config/database');

// Importar models
const UserModel = require('./models/User');
const MovieModel = require('./models/Movie');
const TicketModel = require('./models/Ticket');
const PromotionModel = require('./models/Promotion');

// Inicializar models
const User = UserModel(sequelize);
const Movie = MovieModel(sequelize);
const Ticket = TicketModel(sequelize);
const Promotion = PromotionModel(sequelize);

// Associações (mantidas para queries)
User.hasMany(Ticket, { foreignKey: 'User Id', as: 'Tickets' });
Ticket.belongsTo(User, { foreignKey: 'User Id', as: 'User ' });
Movie.hasMany(Ticket, { foreignKey: 'MovieId', as: 'Tickets' });
Ticket.belongsTo(Movie, { foreignKey: 'MovieId', as: 'Movie' });

// Conexão e Sync
sequelize.authenticate()
  .then(() => console.log('✅ MySQL conectado!'))
  .catch(err => console.error('❌ Erro MySQL:', err));

sequelize.sync({ force: false, alter: true })
  .then(() => console.log('✅ Tabelas sincronizadas!'))
  .catch(err => console.error('❌ Erro sync:', err));

// Rotas (sem auth)
app.use('/api/auth', require('./routes/auth'));  // Mantido, mas simplificado
app.use('/api/movies', require('./routes/movies'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/analytics', require('./routes/analytics'));

// Seed (simplificado, sem admin role)
const seedData = async () => {
  try {
    const movieCount = await Movie.count();
    if (movieCount === 0) {
      await Movie.create({
        title: 'Demon Slayer: Kimetsu no Yaiba',
        duration: '2h35m',
        genre: 'Animação',
        synopsis: 'Tanjiro descobre sua família massacrada...',
        poster: 'https://via.placeholder.com/300x450?text=Demon+Slayer',
        cinemaLocation: 'Cinema do Bairro Local',
        totalSeats: 100,
        availableSeats: 80
      });
      console.log('✅ Filme inserido!');
    }

    const promoCount = await Promotion.count();
    if (promoCount === 0) {
      await Promotion.create({
        name: 'Pacote Família',
        description: '20% off para grupos',
        discount: 20,
        type: 'package',
        validFrom: new Date(),
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      });
      console.log('✅ Promoção inserida!');
    }

    // User de exemplo simples (sem role)
    const userCount = await User.count();
    if (userCount === 0) {
      await User.create({
        username: 'userdemo',
        email: 'demo@cinema.com',
        password: 'demo123'  // Hasheada auto
      });
      console.log('✅ User demo: demo@cinema.com / demo123');
    }
  } catch (err) {
    console.error('❌ Erro seed:', err);
  }
};

sequelize.sync().then(seedData);

// Saúde
app.get('/api/health', (req, res) => res.json({ status: 'OK', db: 'MySQL' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server em http://localhost:${PORT}`));
