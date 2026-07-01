const express = require('express');
const router = express.Router();
const { liste, detail, creer, modifier, supprimer } = require('../controllers/categorieController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');

router.get('/', liste);
router.get('/:id', detail);
router.post('/', protect, adminOnly, creer);
router.put('/:id', protect, adminOnly, modifier);
router.delete('/:id', protect, adminOnly, supprimer);

module.exports = router;
