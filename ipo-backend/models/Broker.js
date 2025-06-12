const mongoose = require("mongoose");

const BrokerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a broker name"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  fees: {
    // Could be more complex, e.g., an object with different fee types
    type: String, 
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  features: {
    type: [String], // Array of feature strings
  },
  // Add other relevant fields like account minimums, platforms, etc.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Broker", BrokerSchema);

