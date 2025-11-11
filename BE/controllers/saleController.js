const Sale = require('../models/Sale');

const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({});
    res.json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const getSale = async (req, res) => {
  try {
    const sale = await Sale.findOne({ SaleID: req.params.id });
    
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }
    
    res.json({
      success: true,
      data: sale
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
  getSales,
  getSale
};