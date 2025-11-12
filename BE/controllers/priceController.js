const Price = require('../models/Price');

// GET /api/prices
const getPrices = async (req, res) => {
  try {
    const prices = await Price.find({});
    res.json({
      success: true,
      count: prices.length,
      data: prices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// GET /api/prices/:id
const getPrice = async (req, res) => {
  try {
    const price = await Price.findOne({ PriceID: req.params.id });
    
    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Price not found'
      });
    }
    
    res.json({
      success: true,
      data: price
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// GET /api/prices by ProductID
const getPricesByProductId = async (req, res) => {
  try {
    const { productId } = req.query;
    const filter = productId ? { ProductID: productId } : {};
    
    const prices = await Price.find(filter);
    res.json({
      success: true,
      count: prices.length,
      data: prices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// GET /api/prices by status
const getPricesByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { 'Info.Status': status } : {};
    
    const prices = await Price.find(filter);
    res.json({
      success: true,
      count: prices.length,
      data: prices
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
  getPrices,
  getPrice,
  getPricesByProductId,
  getPricesByStatus
};