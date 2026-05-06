const { query } = require('../db');
const bcrypt = require('bcrypt');

async function findAdminByUsername(username) {
  const result = await query(
    'SELECT id, username, password_hash, role FROM admin_users WHERE username = $1',
    [username]
  );
  return result.rows[0] || null;
}

async function findAdminById(id) {
  const result = await query(
    'SELECT id, username, role FROM admin_users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function createAdmin({ username, password_hash }) {
  const result = await query(
    `INSERT INTO admin_users (username, password_hash, email, role, is_active)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, username, role`,
    [username, password_hash, null, 'admin', true]
  );
  return result.rows[0];
}

async function saveRefreshToken(adminId, token, expiresAt) {
  await query(
    'INSERT INTO refresh_tokens (admin_id, token, expires_at) VALUES ($1, $2, $3)',
    [adminId, token, expiresAt]
  );
}

async function findRefreshToken(token) {
  const result = await query(
    'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
    [token]
  );
  return result.rows[0] || null;
}

async function deleteRefreshToken(token) {
  await query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
}

module.exports = {
  findAdminByUsername,
  findAdminById,
  createAdmin,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
};
