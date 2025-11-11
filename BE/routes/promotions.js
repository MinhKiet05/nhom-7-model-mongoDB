const express = require('express');
const router = express.Router();
const { getPromotions, getPromotion } = require('../controllers/promotionController');

router.get('/', getPromotions);
router.get('/:id', getPromotion);

module.exports = router;