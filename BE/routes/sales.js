const express = require('express');
const router = express.Router();
const { getSales, getSale } = require('../controllers/saleController');

router.get('/', getSales);
router.get('/:id', getSale);

module.exports = router;