const express = require('express');
const router = express.Router();
const { preSpendAnalyze } = require('../controllers/advisorController');
const { protect } = require('../middleware/authMiddleware');

router.post('/analyze', protect, preSpendAnalyze);

module.exports = router;
