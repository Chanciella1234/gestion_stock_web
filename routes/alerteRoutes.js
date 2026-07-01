const express = require('express');
const router = express.Router();
const { liste, resoudre } = require('../controllers/alerteController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');

router.get('/', protect, adminOnly, liste);
router.patch('/:id/resoudre', protect, adminOnly, resoudre);

module.exports = router;
