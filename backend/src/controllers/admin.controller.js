/**
 * ========================================
 * ADMIN CONTROLLER
 * ========================================
 * 
 * Controlador para autenticación admin:
 * POST /admin/login - Login con credenciales hardcodeadas
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const adminService = require('../services/admin.service');

// Credenciales hardcodeadas
const HARDCODED_USERNAME = 'admin';
const HARDCODED_PASSWORD = '1234';

/**
 * POST /admin/login
 * 
 * Flujo:
 * 1. Recibir username y password
 * 2. Validar credenciales HARDCODEADAS
 * 3. Buscar admin en BD, crear si no existe
 * 4. Generar JWT (1h expiración)
 * 5. Responder con token
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Validar que se envíen datos
    if (!username || !password) {
      return res.status(400).json({ error: 'username y password requeridos' });
    }

    // Validar credenciales HARDCODEADAS
    if (username !== HARDCODED_USERNAME || password !== HARDCODED_PASSWORD) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Buscar admin en BD
    let admin = await adminService.findAdminByUsername(username);

    // Si no existe → crear con bcrypt hash
    if (!admin) {
      const passwordHash = await bcrypt.hash(password, 10);
      admin = await adminService.createAdmin({
        username,
        password_hash: passwordHash,
      });
      console.log(`✅ Admin '${username}' creado automáticamente en BD`);
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error en login:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  login,
};
