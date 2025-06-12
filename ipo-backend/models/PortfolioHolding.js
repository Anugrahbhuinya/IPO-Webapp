const mongoose = require("mongoose");

const PortfolioHoldingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  ipo: {
    type: mongoose.Schema.ObjectId,
    ref: "IPO",
    required: true,
  },
  ipoSymbol: { // Store symbol for easier display
    type: String,
    required: true,
  },
  ipoCompanyName: { // Store company name for easier display
    type: String,
    required: true,
  },
  shares: {
    type: Number,
    required: true,
    min: [1, "Must hold at least one share"],
  },
  purchasePrice: {
    type: Number,
    required: true, // Price per share at the time of purchase
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a user holds a specific IPO only once (update shares instead of creating new doc)
PortfolioHoldingSchema.index({ user: 1, ipo: 1 }, { unique: true });

module.exports = mongoose.model("PortfolioHolding", PortfolioHoldingSchema);

