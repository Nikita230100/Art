const router = require('express').Router();
const AIController = require('../controllers/AI.controller');

router.post('/generate', AIController.generateText);

module.exports = router;