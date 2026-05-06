const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const adminService = require('../services/admin.service');

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh';
const REFRESH_EXPIRES_DAYS = 7;

async function login(req, res) {
  try {
    const { username, password } = req.body;

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

    const payload = { id: admin.id, username: admin.username, role: admin.role };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });

    const refreshToken = jwt.sign({ id: admin.id }, REFRESH_SECRET, {
      expiresIn: `${REFRESH_EXPIRES_DAYS}d`,
    });

    const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
    await adminService.saveRefreshToken(admin.id, refreshToken, expiresAt);

    return res.status(200).json({ token, refreshToken });
  } catch (error) {
    console.error('Error en login:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;

    const stored = await adminService.findRefreshToken(refreshToken);
    if (!stored) {
      return res.status(401).json({ error: 'Refresh token inválido o expirado' });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const admin = await adminService.findAdminById(decoded.id);

    if (!admin) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(401).json({ error: 'Refresh token inválido' });
  }
}

async function logout(req, res) {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await adminService.deleteRefreshToken(refreshToken);
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error en logout:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { login, refresh, logout };
