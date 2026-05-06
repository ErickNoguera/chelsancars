const express = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/admin.controller');
const { loginLimiter, refreshLimiter } = require('../middlewares/rateLimiter');
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

router.post(
  '/refresh',
  refreshLimiter,
  [body('refreshToken').notEmpty().withMessage('refreshToken es requerido')],
  validate,
  adminController.refresh
);

router.post('/logout', adminController.logout);

module.exports = router;
