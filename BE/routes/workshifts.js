const express = require('express');
const router = express.Router();
const { getWorkshifts, getWorkshift } = require('../controllers/workshiftController');

// GET /api/workshifts
router.get('/', getWorkshifts);

// GET /api/workshifts/:id
router.get('/:id', getWorkshift);

module.exports = router;