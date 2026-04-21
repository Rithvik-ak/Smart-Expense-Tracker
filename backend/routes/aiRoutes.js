const express = require('express');
const { getInsights } = require('../controllers/aiController');

const router = express.Router();

router.get('/insights', getInsights);

module.exports = router;
