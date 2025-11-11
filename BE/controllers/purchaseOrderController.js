const PurchaseOrder = require('../models/PurchaseOrder');

const getPurchaseOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find({});
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const getPurchaseOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.findOne({ PurchaseOrderID: req.params.id });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
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
  getPurchaseOrders,
  getPurchaseOrder
};