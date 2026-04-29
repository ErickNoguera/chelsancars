/**
 * ========================================
 * ADMIN SERVICE
 * ========================================
 * 
 * Responsabilidades:
 * - Buscar usuario admin por username
 * - Crear usuario admin si no existe
 */

const { query } = require('../db');
const bcrypt = require('bcrypt');

/**
 * Busca un admin por username
 */
async function findAdminByUsername(username) {
  try {
    const result = await query(
      'SELECT id, username, password_hash, role FROM admin_users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding admin:', error.message);
    throw error;
  }
}

/**
 * Crea un nuevo admin con contraseña hasheada
 */
async function createAdmin({ username, password_hash }) {
  try {
    const result = await query(
      `INSERT INTO admin_users (username, password_hash, email, role, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, role`,
      [username, password_hash, null, 'admin', true]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating admin:', error.message);
    throw error;
  }
}

module.exports = {
  findAdminByUsername,
  createAdmin,
};
