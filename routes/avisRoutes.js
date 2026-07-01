const express = require('express');
const router = express.Router();
const { liste, listeNonValides, creer, valider, supprimer } = require('../controllers/avisController');
const { protect } = require('../middleware/auth');
const { adminOnly, clientOnly } = require('../middleware/roles');

router.get('/', liste);
router.get('/non-valides', protect, adminOnly, listeNonValides);
router.post('/', protect, clientOnly, creer);
router.patch('/:id/valider', protect, adminOnly, valider);
router.delete('/:id', protect, adminOnly, supprimer);

module.exports = router;
