/**
 * ========================================
 * ADMIN ROUTES
 * ========================================
 * 
 * Rutas de autenticación admin:
 * POST /admin/login - Login
 */

const express = require('express');
const adminController = require('../controllers/admin.controller');
const { loginLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.post('/login', loginLimiter, adminController.login);

module.exports = router;
