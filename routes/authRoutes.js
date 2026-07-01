const express = require('express');
const router = express.Router();
const { inscription, connexion, profil, supprimerCompte, listeClients } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');

router.post('/register', inscription);
router.post('/login', connexion);
router.get('/me', protect, profil);
router.delete('/compte', protect, supprimerCompte);
router.get('/clients', protect, adminOnly, listeClients);

module.exports = router;
