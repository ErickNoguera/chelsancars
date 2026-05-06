const express = require('express');
const { body } = require('express-validator');
const { improveTextController } = require('../controllers/ai.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { aiLimiter } = require('../middlewares/rateLimiter');
const { validate } = require('../middlewares/validate');

const router = express.Router();

router.post(
  '/improve-text',
  aiLimiter,
  verifyToken,
  [body('text').trim().notEmpty().withMessage('text es requerido')],
  validate,
  improveTextController
);

module.exports = router;
