const LeadModel = require('../models/leadModel');

// @route  GET /api/dashboard/stats
// @access Private (admin, commercial)
const getStats = async (req, res, next) => {
  try {
    const stats = await LeadModel.getStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
