const fs = require('fs');
const { sequelize, User, Movie, Ticket, Promotion } = require('./models');

async function backup() {
  try {
    console.log('Iniciando backup...');

    // Exporta dados (exclui senhas hashed para segurança)
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    const movies = await Movie.findAll();
    const tickets = await Ticket.findAll({ include: [User , Movie, { model: Promotion, as: 'promotion' }] });
    const promotions = await Promotion.findAll();

    const backupData = {
      timestamp: new Date().toISOString(),
      users: users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, points: u.points })),
      movies: movies.map(m => ({ id: m.id, title: m.title, time: m.time, seatsAvailable: m.seatsAvailable, ...m.dataValues })),
      tickets: tickets.map(t => ({
        id: t.id,
        user: { id: t.User.id, name: t.User.name },
        movie: { id: t.Movie.id, title: t.Movie.title },
        promotion: t.promotion ? { id: t.promotion.id, name: t.promotion.name, discount: t.promotion.discount } : null,
        seatNumber: t.seatNumber,
        price: t.price,
        status: t.status,
        discountApplied: t.discountApplied
      })),
      promotions: promotions.map(p => ({ id: p.id, name: p.name, discount: p.discount, shareLink: p.shareLink, ...p.dataValues }))
    };

    // Salva em JSON (local seguro; não inclui .env ou senhas)
    fs.writeFileSync('./backup.json', JSON.stringify(backupData, null, 2));
    console.log('Backup salvo com sucesso em backup.json (dados de clientes/transações seguros, sem senhas).');
  } catch (error) {
    console.error('Erro no backup:', error.message);
  } finally {
    await sequelize.close(); // Fecha conexão DB
  }
}

backup();
