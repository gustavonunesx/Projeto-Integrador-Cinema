const { sequelize, User, Movie, Promotion } = require('./models');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // Apaga e recria tabelas (use alter: true em prod para não perder dados)

    console.log('Inserindo dados de teste...');

    // Cria admin e user teste (senhas: admin123 / user123)
    const admin = await User.create({ name: 'Admin Cinema', email: 'admin@cinema.com', password: 'admin123', role: 'admin' });
    const user = await User.create({ name: 'Cliente Teste', email: 'user@cinema.com', password: 'user123', role: 'user' });

    // Cria filmes/sessões (com horários, assentos)
    await Movie.create({ 
      title: 'Filme Teste 1', 
      description: 'Descrição teste 1', 
      duration: 120, 
      time: '18:00:00', 
      seatsAvailable: 20, 
      image: 'https://example.com/poster1.jpg' 
    });
    await Movie.create({ 
      title: 'Filme Teste 2', 
      description: 'Descrição teste 2', 
      duration: 90, 
      time: '20:00:00', 
      seatsAvailable: 15, 
      image: 'https://example.com/poster2.jpg' 
    });

    // Cria promoções (com shareLink para marketing)
    await Promotion.create({ 
      name: 'Desconto Família', 
      discount: 20, 
      description: '20% off para famílias', 
      validFrom: new Date(), 
      validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      shareLink: 'https://facebook.com/share/promotion-familia' 
    });

    console.log('Seeds inseridos com sucesso! Admin: admin@cinema.com / admin123 | User: user@cinema.com / user123');
    console.log('Verifique o DB MySQL (tabelas: Users, Movies, Promotions).');
  } catch (error) {
    console.error('Erro nos seeds:', error.message);
  } finally {
    await sequelize.close();
  }
}

seed();
