const express = require('express');
const router = express.Router();
const { obtenir, ajouter, modifierQuantite, supprimerLigne, vider } = require('../controllers/panierController');
const { protect } = require('../middleware/auth');
const { clientOnly } = require('../middleware/roles');

router.get('/', protect, clientOnly, obtenir);
router.post('/ajouter', protect, clientOnly, ajouter);
router.put('/:ligneId', protect, clientOnly, modifierQuantite);
router.delete('/:ligneId', protect, clientOnly, supprimerLigne);
router.delete('/vider', protect, clientOnly, vider);

module.exports = router;
