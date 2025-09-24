const { sequelize, User, Movie, Ticket, Promotion } = require('./models');
const fs = require('fs');

async function backup() {
  try {
    // Exporta todos os dados para JSON
    const users = await User.findAll({ attributes: { exclude: ['password'] } }); // Sem senha hashed
    const movies = await Movie.findAll();
    const tickets = await Ticket.findAll({ include: [User , Movie, { model: Promotion, as: 'promotion' }] });
    const promotions = await Promotion.findAll();

    const backupData = {
      users: users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, points: u.points })),
      movies,
      tickets: tickets.map(t => ({
        id: t.id,
        user: { id: t.User.id, name: t.User.name },
        movie: { id: t.Movie.id, title: t.Movie.title },
        promotion: t.promotion ? { id: t.promotion.id, name: t.promotion.name } : null,
        seatNumber: t.seatNumber,
        price: t.price,
        status: t.status,
        discountApplied: t.discountApplied
      })),
      promotions
    };

    fs.writeFileSync('./backup.json', JSON.stringify(backupData, null, 2));
    console.log('Backup salvo em backup.json');
  } catch (error) {
    console.error('Erro no backup:', error);
  }
}

backup();
