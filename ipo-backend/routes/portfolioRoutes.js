const express = require("express");
const {
  getPortfolio,
  buyIPO,
  sellIPO,
} = require("../controllers/portfolioController");

const router = express.Router();

// Import middleware
const { protect } = require("../middleware/authMiddleware");
// No admin authorization needed here, regular users manage their own portfolio

// Apply protect middleware to all routes in this file
router.use(protect);

router.route("/").get(getPortfolio);
router.route("/buy/:ipoId").post(buyIPO);
router.route("/sell/:holdingId").post(sellIPO);

module.exports = router;

