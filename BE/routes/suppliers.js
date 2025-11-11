const express = require('express');
const router = express.Router();
const { getSuppliers, getSupplier } = require('../controllers/supplierController');

// GET /api/suppliers
router.get('/', getSuppliers);

// GET /api/suppliers/:id
router.get('/:id', getSupplier);

module.exports = router;