const Return = require('../models/Return');

// GET /api/returns
const getReturns = async (req, res) => {
  try {
    const returns = await Return.find({});
    res.json({
      success: true,
      count: returns.length,
      data: returns
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// GET /api/returns/:id
const getReturn = async (req, res) => {
  try {
    const returnDoc = await Return.findOne({ ReturnID: req.params.id });
    
    if (!returnDoc) {
      return res.status(404).json({
        success: false,
        message: 'Return not found'
      });
    }
    
    res.json({
      success: true,
      data: returnDoc
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
  getReturns,
  getReturn
};