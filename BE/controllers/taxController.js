const Tax = require('../models/Tax');

// GET /api/tax
const getTaxes = async (req, res) => {
  try {
    const taxes = await Tax.find({});
    res.json({
      success: true,
      count: taxes.length,
      data: taxes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// GET /api/tax/:id
const getTax = async (req, res) => {
  try {
    const tax = await Tax.findOne({ taxCode: req.params.id });
    
    if (!tax) {
      return res.status(404).json({
        success: false,
        message: 'Tax not found'
      });
    }
    
    res.json({
      success: true,
      data: tax
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// GET /api/tax by status
const getTaxesByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const taxes = await Tax.find(filter);
    res.json({
      success: true,
      count: taxes.length,
      data: taxes
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
  getTaxes,
  getTax,
  getTaxesByStatus
};