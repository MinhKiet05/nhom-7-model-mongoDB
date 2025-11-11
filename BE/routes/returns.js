const express = require('express');
const router = express.Router();
const { getReturns, getReturn } = require('../controllers/returnController');

// GET /api/returns
router.get('/', getReturns);

// GET /api/returns/:id
router.get('/:id', getReturn);

module.exports = router;