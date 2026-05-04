const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const adminService = require('../services/admin.service');

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username y password requeridos' });
    }

    const adminUser = process.env.ADMIN_USER;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPassword) {
      console.error('❌ ADMIN_USER o ADMIN_PASSWORD no están definidos en las variables de entorno');
      return res.status(500).json({ error: 'Error de configuración del servidor' });
    }

    if (username !== adminUser || password !== adminPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    let admin = await adminService.findAdminByUsername(username);

    if (!admin) {
      const passwordHash = await bcrypt.hash(password, 10);
      admin = await adminService.createAdmin({ username, password_hash: passwordHash });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error en login:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { login };
