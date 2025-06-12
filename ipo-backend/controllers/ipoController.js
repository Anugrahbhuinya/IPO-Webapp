const IPO = require("../models/IPO");
const { getFromCache, setInCache, deleteFromCache } = require("../config/redisClient");

const CACHE_KEYS = {
    ALL_IPOS: 'all_ipos',
    UPCOMING_IPOS: 'upcoming_ipos',
    IPO_BY_ID: (id) => `ipo_${id}`
};

// Helper function to clear relevant IPO caches
const clearIPOCaches = async (ipoId = null) => {
    await deleteFromCache(CACHE_KEYS.ALL_IPOS);
    await deleteFromCache(CACHE_KEYS.UPCOMING_IPOS);
    if (ipoId) {
        await deleteFromCache(CACHE_KEYS.IPO_BY_ID(ipoId));
    }
};

// Helper function to emit IPO update event via Socket.IO
const emitIPOUpdate = (req) => {
    const io = req.app.get("io");
    if (io) {
        io.emit("ipoUpdate"); // Emit a generic event, client can refetch
        // Alternatively, emit specific data: io.emit("ipoUpdate", { type: 'create/update/delete', data: ipo });
        console.log("Emitted ipoUpdate event");
    }
};

// @desc    Get all IPOs (can add filtering/pagination later)
// @route   GET /api/ipos
// @route   GET /api/ipos/upcoming (Example filter)
// @access  Public
exports.getIPOs = async (req, res, next) => {
  const isUpcoming = req.path.includes("upcoming");
  const cacheKey = isUpcoming ? CACHE_KEYS.UPCOMING_IPOS : CACHE_KEYS.ALL_IPOS;

  try {
    const cachedIPOs = await getFromCache(cacheKey);
    if (cachedIPOs) {
      return res.status(200).json({ success: true, count: cachedIPOs.length, data: cachedIPOs, source: 'cache' });
    }

    let query;
    if (isUpcoming) {
      query = IPO.find({ status: "upcoming" });
    } else {
      query = IPO.find();
    }
    query = query.sort({ ipoDate: 1 });
    const ipos = await query;

    await setInCache(cacheKey, ipos);

    res.status(200).json({ success: true, count: ipos.length, data: ipos, source: 'db' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single IPO by ID
// @route   GET /api/ipos/:id
// @access  Public
exports.getIPO = async (req, res, next) => {
  const cacheKey = CACHE_KEYS.IPO_BY_ID(req.params.id);
  try {
    const cachedIPO = await getFromCache(cacheKey);
    if (cachedIPO) {
        return res.status(200).json({ success: true, data: cachedIPO, source: 'cache' });
    }

    const ipo = await IPO.findById(req.params.id);
    if (!ipo) {
      return res.status(404).json({ success: false, error: `IPO not found with id of ${req.params.id}` });
    }

    await setInCache(cacheKey, ipo);

    res.status(200).json({ success: true, data: ipo, source: 'db' });
  } catch (error) {
    if (error.name === 'CastError') {
        return res.status(404).json({ success: false, error: `IPO not found with id of ${req.params.id}` });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new IPO
// @route   POST /api/ipos
// @access  Private/Admin
exports.createIPO = async (req, res, next) => {
  try {
    const ipo = await IPO.create(req.body);
    await clearIPOCaches();
    emitIPOUpdate(req); // Emit update event
    res.status(201).json({
      success: true,
      data: ipo,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update IPO
// @route   PUT /api/ipos/:id
// @access  Private/Admin
exports.updateIPO = async (req, res, next) => {
  try {
    let ipo = await IPO.findById(req.params.id);
    if (!ipo) {
      return res.status(404).json({ success: false, error: `IPO not found with id of ${req.params.id}` });
    }

    ipo = await IPO.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    await clearIPOCaches(req.params.id);
    emitIPOUpdate(req); // Emit update event

    res.status(200).json({ success: true, data: ipo });
  } catch (error) {
    if (error.name === 'CastError') {
        return res.status(404).json({ success: false, error: `IPO not found with id of ${req.params.id}` });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete IPO
// @route   DELETE /api/ipos/:id
// @access  Private/Admin
exports.deleteIPO = async (req, res, next) => {
  try {
    const ipo = await IPO.findById(req.params.id);
    if (!ipo) {
      return res.status(404).json({ success: false, error: `IPO not found with id of ${req.params.id}` });
    }

    await ipo.deleteOne();
    await clearIPOCaches(req.params.id);
    emitIPOUpdate(req); // Emit update event

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
     if (error.name === 'CastError') {
        return res.status(404).json({ success: false, error: `IPO not found with id of ${req.params.id}` });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

