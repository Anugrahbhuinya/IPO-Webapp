const express = require("express");
const {
  syncIPOData,
  getSyncStatus
} = require("../controllers/ipoRealTimeController");

const router = express.Router();

// Import middleware
const { protect, authorize } = require("../middleware/authMiddleware");

// All routes require admin authorization
router.use(protect);
router.use(authorize('admin'));

router.route("/").post(syncIPOData);
router.route("/status").get(getSyncStatus);

module.exports = router;
