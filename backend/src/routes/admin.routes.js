/**
 * ========================================
 * ADMIN ROUTES
 * ========================================
 * 
 * Rutas de autenticación admin:
 * POST /admin/login - Login
 */

const express = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/admin.controller');
const { loginLimiter } = require('../middlewares/rateLimiter');
const { validate } = require('../middlewares/validate');

const router = express.Router();

router.post(
  '/login',
  loginLimiter,
  [
    body('username').trim().notEmpty().withMessage('username es requerido'),
    body('password').notEmpty().withMessage('password es requerido'),
  ],
  validate,
  adminController.login
);

module.exports = router;
