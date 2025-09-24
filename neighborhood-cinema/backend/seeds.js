const { sequelize, User, Movie, Promotion } = require('./models');

async function seed() {
  await sequelize.sync({ force: true }); // Apaga e recria (use alter: true em prod)

  // Cria admin e user teste
  await User.create({ name: 'Admin', email: 'admin@cinema.com', password: 'admin123', role: 'admin' });
  await User.create({ name: 'User ', email: 'user@cinema.com', password: 'user123', role: 'user' });

  // Cria filmes
  await Movie.create({ title: 'Filme Teste 1', description: 'Descrição 1', duration: 120, time: '18:00:00', seatsAvailable: 20, image: 'https://example.com/poster1.jpg' });
  await Movie.create({ title: 'Filme Teste 2', description: 'Descrição 2', duration: 90, time: '20:00:00', seatsAvailable: 15, image: 'https://example.com/poster2.jpg' });

  // Cria promoções
  await Promotion.create({ name: 'Desconto Família', discount: 20, description: '20% off para famílias', validFrom: new Date(), validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), shareLink: 'https://facebook.com/share/promotion1' });

  console.log('Seeds inseridos!');
}

seed().catch(console.error);
