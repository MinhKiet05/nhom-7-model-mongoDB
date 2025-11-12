const express = require('express');
const router = express.Router();
const { getTaxes, getTax, getTaxesByStatus } = require('../controllers/taxController');

// GET /api/tax
router.get('/', getTaxes);

// GET /api/tax/:id
router.get('/:id', getTax);

module.exports = router;