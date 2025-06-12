const ipoAlertsService = require('../services/ipoAlertsService');
const { clearIPOCaches } = require('../utils/cacheUtils');

// @desc    Sync IPO data from IPOAlerts.in API
// @route   POST /api/ipos/sync
// @access  Private/Admin
exports.syncIPOData = async (req, res, next) => {
  try {
    const result = await ipoAlertsService.syncIPOData();
    
    // If sync was successful, clear all IPO caches
    if (result.success) {
      await clearIPOCaches();
      
      // Emit update event via Socket.IO if available
      const io = req.app.get("io");
      if (io) {
        io.emit("ipoUpdate", { type: 'sync', stats: result.stats });
        console.log("Emitted ipoUpdate event after sync");
      }
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in syncIPOData controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync IPO data',
      error: error.message
    });
  }
};

// @desc    Get IPO data status (last sync time, counts)
// @route   GET /api/ipos/sync/status
// @access  Private/Admin
exports.getSyncStatus = async (req, res, next) => {
  try {
    // This could be enhanced to store and retrieve actual sync status from database
    // For now, we'll return a simple response
    res.status(200).json({
      success: true,
      message: 'IPO sync status',
      data: {
        lastSync: new Date(), // This should ideally come from a stored value
        provider: 'IPOAlerts.in',
        status: 'Ready for sync'
      }
    });
  } catch (error) {
    console.error('Error in getSyncStatus controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get sync status',
      error: error.message
    });
  }
};
