const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const User = require('../models/User')(sequelize);

// Register (simples, sem token)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser  = await User.findOne({ where: { email } });
    if (existingUser ) return res.status(400).json({ msg: 'Usuário existe' });

    const newUser  = await User.create({ username, email, password });
    res.json({ msg: 'Registrado!', user: { id: newUser .id, username, email } });
  } catch (err) {
    res.status(500).json({ msg: 'Erro servidor' });
  }
});

// Login (simples, retorna user sem token)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }
    res.json({ msg: 'Logado!', user: { id: user.id, username: user.username, email } });
  } catch (err) {
    res.status(500).json({ msg: 'Erro servidor' });
  }
});

module.exports = router;
