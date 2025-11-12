const Price = require('../models/Price');

// GET /api/prices - Return all price entries with optional filtering
const getPrices = async (req, res) => {
  try {
    const filter = {};
    if (req.query.productId) filter.ProductID = req.query.productId;
    if (req.query.unitId) filter.UnitID = req.query.unitId;
    if (req.query.status) filter['Info.Status'] = req.query.status;

    const prices = await Price.find(filter).sort({ ProductID: 1, Start: -1 });
    res.json(prices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/prices/:id - Get single price by ID
const getPrice = async (req, res) => {
  try {
    const price = await Price.findById(req.params.id);
    if (!price) return res.status(404).json({ message: 'Price not found' });
    res.json(price);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/prices/product/:productId - Get prices by ProductID
const getPricesByProductId = async (req, res) => {
  try {
    const productId = req.params.productId;
    const prices = await Price.find({ ProductID: productId }).sort({ Start: -1 });
    res.json(prices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/prices by status (via query param)
const getPricesByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { 'Info.Status': status } : {};
    
    const prices = await Price.find(filter);
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPrices,
  getPrice,
  getPricesByProductId,
  getPricesByStatus
};