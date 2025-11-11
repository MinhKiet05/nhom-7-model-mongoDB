const Workshift = require('../models/Workshift');

// GET /api/workshifts
const getWorkshifts = async (req, res) => {
  try {
    const workshifts = await Workshift.find({});
    res.json({
      success: true,
      count: workshifts.length,
      data: workshifts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// GET /api/workshifts/:id
const getWorkshift = async (req, res) => {
  try {
    const workshift = await Workshift.findOne({ ShiftID: req.params.id });
    
    if (!workshift) {
      return res.status(404).json({
        success: false,
        message: 'Workshift not found'
      });
    }
    
    res.json({
      success: true,
      data: workshift
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
  getWorkshifts,
  getWorkshift
};