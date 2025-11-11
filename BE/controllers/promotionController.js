const Promotion = require('../models/Promotion');

const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({});
    res.json({
      success: true,
      count: promotions.length,
      data: promotions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const getPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findOne({ PromotionID: req.params.id });
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }
    
    res.json({
      success: true,
      data: promotion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getPromotions,
  getPromotion
};