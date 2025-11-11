const express = require('express');
const router = express.Router();
const { getPurchaseOrders, getPurchaseOrder } = require('../controllers/purchaseOrderController');

router.get('/', getPurchaseOrders);
router.get('/:id', getPurchaseOrder);

module.exports = router;