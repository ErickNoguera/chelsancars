/**
 * ========================================
 * AUTH MIDDLEWARE
 * ========================================
 * 
 * Middleware para verificar JWT en headers
 * Uso: app.use('/protected-route', verifyToken)
 */

const jwt = require('jsonwebtoken');

/**
 * verifyToken
 * 
 * Flujo:
 * 1. Leer header Authorization: Bearer <token>
 * 2. Si no existe → 401
 * 3. Verificar token con JWT_SECRET
 * 4. Si válido → req.user = decoded, next()
 * 5. Si falla → 403
 */
function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Validar que exista el header
    if (!authHeader) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // Extraer token del formato "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }

    const token = parts[1];

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expirado' });
    }
    return res.status(403).json({ error: 'Token inválido' });
  }
}

module.exports = {
  verifyToken,
};
