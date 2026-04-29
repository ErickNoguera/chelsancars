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

const router = express.Router();

/**
 * POST /admin/login
 * Autentica al admin y devuelve JWT
 */
router.post('/login', adminController.login);

module.exports = router;
