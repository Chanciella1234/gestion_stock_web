const express = require('express');
const router = express.Router();
const { stats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');

router.get('/stats', protect, adminOnly, stats);

module.exports = router;
