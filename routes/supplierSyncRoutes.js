const express = require('express');
const router = express.Router();
const { synchroniser } = require('../controllers/supplierSyncController');

router.post('/:supplierId/sync', synchroniser);

module.exports = router;