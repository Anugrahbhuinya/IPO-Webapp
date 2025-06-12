const Investor = require("../models/Investor");
const { getFromCache, setInCache, deleteFromCache } = require("../config/redisClient");

const CACHE_KEYS = {
    ALL_INVESTORS: 'all_investors',
    INVESTOR_BY_ID: (id) => `investor_${id}`
};

// Helper function to clear relevant investor caches
const clearInvestorCaches = async (investorId = null) => {
    await deleteFromCache(CACHE_KEYS.ALL_INVESTORS);
    if (investorId) {
        await deleteFromCache(CACHE_KEYS.INVESTOR_BY_ID(investorId));
    }
};

// @desc    Get all investors
// @route   GET /api/investors
// @access  Public (or Private depending on requirements)
exports.getInvestors = async (req, res, next) => {
  const cacheKey = CACHE_KEYS.ALL_INVESTORS;
  try {
    const cachedInvestors = await getFromCache(cacheKey);
    if (cachedInvestors) {
        return res.status(200).json({ success: true, count: cachedInvestors.length, data: cachedInvestors, source: 'cache' });
    }

    const investors = await Investor.find();
    await setInCache(cacheKey, investors);

    res.status(200).json({ success: true, count: investors.length, data: investors, source: 'db' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single investor by ID
// @route   GET /api/investors/:id
// @access  Public (or Private)
exports.getInvestor = async (req, res, next) => {
  const cacheKey = CACHE_KEYS.INVESTOR_BY_ID(req.params.id);
  try {
    const cachedInvestor = await getFromCache(cacheKey);
    if (cachedInvestor) {
        return res.status(200).json({ success: true, data: cachedInvestor, source: 'cache' });
    }

    const investor = await Investor.findById(req.params.id);
    if (!investor) {
      return res.status(404).json({ success: false, error: `Investor not found with id of ${req.params.id}` });
    }

    await setInCache(cacheKey, investor);

    res.status(200).json({ success: true, data: investor, source: 'db' });
  } catch (error) {
    if (error.name === 'CastError') {
        return res.status(404).json({ success: false, error: `Investor not found with id of ${req.params.id}` });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new investor
// @route   POST /api/investors
// @access  Private/Admin
exports.createInvestor = async (req, res, next) => {
  try {
    const investor = await Investor.create(req.body);
    await clearInvestorCaches(); // Clear cache
    res.status(201).json({ success: true, data: investor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update investor
// @route   PUT /api/investors/:id
// @access  Private/Admin
exports.updateInvestor = async (req, res, next) => {
  try {
    let investor = await Investor.findById(req.params.id);
    if (!investor) {
      return res.status(404).json({ success: false, error: `Investor not found with id of ${req.params.id}` });
    }
    investor = await Investor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    await clearInvestorCaches(req.params.id); // Clear cache
    res.status(200).json({ success: true, data: investor });
  } catch (error) {
    if (error.name === 'CastError') {
        return res.status(404).json({ success: false, error: `Investor not found with id of ${req.params.id}` });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete investor
// @route   DELETE /api/investors/:id
// @access  Private/Admin
exports.deleteInvestor = async (req, res, next) => {
  try {
    const investor = await Investor.findById(req.params.id);
    if (!investor) {
      return res.status(404).json({ success: false, error: `Investor not found with id of ${req.params.id}` });
    }
    await investor.deleteOne();
    await clearInvestorCaches(req.params.id); // Clear cache
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.name === 'CastError') {
        return res.status(404).json({ success: false, error: `Investor not found with id of ${req.params.id}` });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

