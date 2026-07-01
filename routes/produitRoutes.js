const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { liste, detail, creer, modifier, supprimer } = require('../controllers/produitController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');

router.get('/', liste);
router.get('/:id', detail);
router.post('/', protect, adminOnly, upload.single('image'), creer);
router.put('/:id', protect, adminOnly, upload.single('image'), modifier);
router.delete('/:id', protect, adminOnly, supprimer);

module.exports = router;
