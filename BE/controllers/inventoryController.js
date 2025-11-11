const Inventory = require('../models/Inventory');

const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({});
    res.json({
      success: true,
      count: inventory.length,
      data: inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const getInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findOne({ ProductID: req.params.id });
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }
    
    res.json({
      success: true,
      data: item
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
  getInventory,
  getInventoryItem
};