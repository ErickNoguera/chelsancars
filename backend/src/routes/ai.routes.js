const express = require('express');
const { improveTextController } = require('../controllers/ai.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/improve-text', verifyToken, improveTextController);

module.exports = router;
