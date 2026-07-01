const express = require('express');
const router = express.Router();
const { liste, marquerLue } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, liste);
router.patch('/:id/lue', protect, marquerLue);

module.exports = router;
