const Broker = require("../models/Broker");
const { getFromCache, setInCache, deleteFromCache } = require("../config/redisClient");

const CACHE_KEYS = {
    ALL_BROKERS: 'all_brokers',
    BROKER_BY_ID: (id) => `broker_${id}`,
    BROKER_COMPARISON: (ids) => `broker_compare_${ids.sort().join("_")}` // Cache comparison results
};

// Helper function to clear relevant broker caches
const clearBrokerCaches = async (brokerId = null) => {
    await deleteFromCache(CACHE_KEYS.ALL_BROKERS);
    // Potentially clear comparison caches if needed, though they might expire naturally
    if (brokerId) {
        await deleteFromCache(CACHE_KEYS.BROKER_BY_ID(brokerId));
    }
};

// @desc    Get all brokers
// @route   GET /api/brokers
// @access  Public
exports.getBrokers = async (req, res, next) => {
  const cacheKey = CACHE_KEYS.ALL_BROKERS;
  try {
    const cachedBrokers = await getFromCache(cacheKey);
    if (cachedBrokers) {
        return res.status(200).json({ success: true, count: cachedBrokers.length, data: cachedBrokers, source: 'cache' });
    }

    const brokers = await Broker.find();
    await setInCache(cacheKey, brokers);

    res.status(200).json({ success: true, count: brokers.length, data: brokers, source: 'db' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single broker by ID
// @route   GET /api/brokers/:id
// @access  Public
exports.getBroker = async (req, res, next) => {
  const cacheKey = CACHE_KEYS.BROKER_BY_ID(req.params.id);
  try {
    const cachedBroker = await getFromCache(cacheKey);
    if (cachedBroker) {
        return res.status(200).json({ success: true, data: cachedBroker, source: 'cache' });
    }

    const broker = await Broker.findById(req.params.id);
    if (!broker) {
      return res.status(404).json({ success: false, error: `Broker not found with id of ${req.params.id}` });
    }

    await setInCache(cacheKey, broker);

    res.status(200).json({ success: true, data: broker, source: 'db' });
  } catch (error) {
    if (error.name === 'CastError') {
        return res.status(404).json({ success: false, error: `Broker not found with id of ${req.params.id}` });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new broker
// @route   POST /api/brokers
// @access  Private/Admin
exports.createBroker = async (req, res, next) => {
  try {
    const broker = await Broker.create(req.body);
    await clearBrokerCaches(); // Clear cache
    res.status(201).json({ success: true, data: broker });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update broker
// @route   PUT /api/brokers/:id
// @access  Private/Admin
exports.updateBroker = async (req, res, next) => {
  try {
    let broker = await Broker.findById(req.params.id);
    if (!broker) {
      return res.status(404).json({ success: false, error: `Broker not found with id of ${req.params.id}` });
    }
    broker = await Broker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    await clearBrokerCaches(req.params.id); // Clear cache
    res.status(200).json({ success: true, data: broker });
  } catch (error) {
    if (error.name === 'CastError') {
        return res.status(404).json({ success: false, error: `Broker not found with id of ${req.params.id}` });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete broker
// @route   DELETE /api/brokers/:id
// @access  Private/Admin
exports.deleteBroker = async (req, res, next) => {
  try {
    const broker = await Broker.findById(req.params.id);
    if (!broker) {
      return res.status(404).json({ success: false, error: `Broker not found with id of ${req.params.id}` });
    }
    await broker.deleteOne();
    await clearBrokerCaches(req.params.id); // Clear cache
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.name === 'CastError') {
        return res.status(404).json({ success: false, error: `Broker not found with id of ${req.params.id}` });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get broker comparison data
// @route   GET /api/brokers/compare
// @access  Public
exports.compareBrokers = async (req, res, next) => {
    const brokerIds = req.query.ids ? req.query.ids.split(',') : [];
    if (brokerIds.length < 2) {
        return res.status(400).json({ success: false, error: 'Please provide at least two broker IDs to compare.' });
    }

    const cacheKey = CACHE_KEYS.BROKER_COMPARISON(brokerIds);

    try {
        const cachedComparison = await getFromCache(cacheKey);
        if (cachedComparison) {
            return res.status(200).json({ success: true, data: cachedComparison, source: 'cache' });
        }

        const brokers = await Broker.find({ '_id': { $in: brokerIds } });
        // In a real app, format data for comparison
        await setInCache(cacheKey, brokers, 600); // Cache comparison for 10 mins

        res.status(200).json({ success: true, data: brokers, source: 'db' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

