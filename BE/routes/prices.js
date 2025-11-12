const express = require('express');
const router = express.Router();
const { getPrices, getPrice, getPricesByProductId, getPricesByStatus } = require('../controllers/priceController');

// GET /api/prices
router.get('/', getPrices);

// GET /api/prices/:id
router.get('/:id', getPrice);

module.exports = router;