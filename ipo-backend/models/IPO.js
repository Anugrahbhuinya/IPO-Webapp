const mongoose = require("mongoose");

const IPOSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, "Please add a company name"],
    trim: true,
  },
  symbol: {
    type: String,
    required: [true, "Please add a stock symbol"],
    unique: true,
    trim: true,
    uppercase: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  ipoDate: {
    type: Date,
    required: [true, "Please add the IPO date"],
  },
  priceRangeLow: {
    type: Number,
  },
  priceRangeHigh: {
    type: Number,
  },
  sharesOffered: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["upcoming", "active", "past", "cancelled"],
    default: "upcoming",
  },
  // Add other relevant fields like underwriters, filings, etc.
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Optional: Link to the user who registered it (if applicable)
  // registeredBy: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'User'
  // }
});

module.exports = mongoose.model("IPO", IPOSchema);

