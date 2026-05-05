const express = require('express');
const { improveTextController } = require('../controllers/ai.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { aiLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.post('/improve-text', aiLimiter, verifyToken, improveTextController);

module.exports = router;
