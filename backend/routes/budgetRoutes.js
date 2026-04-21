const express = require('express');
const router = express.Router();
const { setBudget, getBudget } = require('../controllers/budgetController');
const { protect } = require('../middlewares/auth');

router.post('/', protect, setBudget);
router.get('/:month/:year', protect, getBudget);

module.exports = router;
