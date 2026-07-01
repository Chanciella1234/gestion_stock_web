const express = require('express');
const router = express.Router();
const { liste, creer, modifier, supprimer, verifier } = require('../controllers/promotionController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');

router.get('/', protect, adminOnly, liste);
router.get('/verifier', verifier);
router.post('/', protect, adminOnly, creer);
router.put('/:id', protect, adminOnly, modifier);
router.delete('/:id', protect, adminOnly, supprimer);

module.exports = router;
