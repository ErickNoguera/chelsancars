const express = require('express');
const { improveTextController } = require('../controllers/ai.controller');

const router = express.Router();

router.post('/improve-text', improveTextController);

module.exports = router;
