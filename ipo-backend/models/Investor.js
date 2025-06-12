const mongoose = require("mongoose");

const InvestorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add an investor name"],
    trim: true,
  },
  investorType: {
    type: String,
    enum: ["individual", "venture_capital", "angel", "institutional", "other"],
    default: "other",
  },
  description: {
    type: String,
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  // Example: Link to IPOs they invested in (if needed)
  // investments: [{
  //   ipo: {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'IPO'
  // },
  //   amount: Number,
  //   date: Date
  // }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Investor", InvestorSchema);

