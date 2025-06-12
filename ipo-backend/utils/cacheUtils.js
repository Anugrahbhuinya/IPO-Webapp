// Cache utility functions for IPO data
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
const emitIPOUpdate = (req, data = null) => {
    const io = req.app.get("io");
    if (io) {
        if (data) {
            io.emit("ipoUpdate", data);
        } else {
            io.emit("ipoUpdate"); // Emit a generic event, client can refetch
        }
        console.log("Emitted ipoUpdate event");
    }
};

module.exports = {
    CACHE_KEYS,
    clearIPOCaches,
    emitIPOUpdate
};
