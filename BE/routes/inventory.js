const express = require('express');
const router = express.Router();
const { getInventory, getInventoryItem } = require('../controllers/inventoryController');

router.get('/', getInventory);
router.get('/:id', getInventoryItem);

module.exports = router;