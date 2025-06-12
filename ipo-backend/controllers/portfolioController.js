const User = require("../models/User");
const PortfolioHolding = require("../models/PortfolioHolding");
const IPO = require("../models/IPO");

// @desc    Get user's portfolio (balance and holdings)
// @route   GET /api/portfolio
// @access  Private
exports.getPortfolio = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming protect middleware adds user to req

    // Fetch user to get balance
    const user = await User.findById(userId).select("virtualBalance name email");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Fetch user's holdings
    const holdings = await PortfolioHolding.find({ user: userId });

    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        virtualBalance: user.virtualBalance,
        holdings: holdings,
      },
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Simulate buying shares of an IPO
// @route   POST /api/portfolio/buy/:ipoId
// @access  Private
exports.buyIPO = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { ipoId } = req.params;
    const { shares } = req.body; // Number of shares to buy

    if (!shares || shares <= 0) {
      return res.status(400).json({ success: false, error: "Please provide a valid number of shares to buy." });
    }

    // 1. Find User and IPO
    const user = await User.findById(userId);
    const ipo = await IPO.findById(ipoId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    if (!ipo) {
      return res.status(404).json({ success: false, error: "IPO not found" });
    }

    // 2. Check if IPO is open or upcoming
    if (!["upcoming", "open"].includes(ipo.status)) {
      return res.status(400).json({ success: false, error: `IPO is not available for purchase (Status: ${ipo.status})` });
    }

    // 3. Determine purchase price (use high end of range or fixed price if available)
    const purchasePricePerShare = ipo.priceRangeHigh || ipo.priceRangeLow; // Simplification
    if (!purchasePricePerShare) {
      return res.status(400).json({ success: false, error: "IPO price not determined." });
    }
    const totalCost = shares * purchasePricePerShare;

    // 4. Check user balance
    if (user.virtualBalance < totalCost) {
      return res.status(400).json({ success: false, error: "Insufficient virtual balance." });
    }

    // 5. Deduct cost from user balance
    user.virtualBalance -= totalCost;
    await user.save();

    // 6. Find existing holding or create new one
    let holding = await PortfolioHolding.findOne({ user: userId, ipo: ipoId });

    if (holding) {
      // Update existing holding
      holding.shares += parseInt(shares);
      await holding.save();
    } else {
      // Create new holding
      holding = await PortfolioHolding.create({
        user: userId,
        ipo: ipoId,
        ipoSymbol: ipo.symbol,
        ipoCompanyName: ipo.companyName,
        shares: parseInt(shares),
        purchasePrice: purchasePricePerShare,
      });
    }

    res.status(200).json({ success: true, data: holding });

  } catch (error) {
    console.error("Error buying IPO:", error);
    // Handle potential duplicate key error if index fails somehow
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: "Transaction conflict, please try again." });
    }
    res.status(500).json({ success: false, error: "Server Error during purchase." });
  }
};

// @desc    Simulate selling shares of an IPO holding
// @route   POST /api/portfolio/sell/:holdingId
// @access  Private
exports.sellIPO = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { holdingId } = req.params;
    const { shares } = req.body; // Number of shares to sell

    if (!shares || shares <= 0) {
      return res.status(400).json({ success: false, error: "Please provide a valid number of shares to sell." });
    }

    // 1. Find the specific holding and the user
    const holding = await PortfolioHolding.findById(holdingId);
    const user = await User.findById(userId);

    if (!holding) {
      return res.status(404).json({ success: false, error: "Holding not found." });
    }
    // Ensure the holding belongs to the user making the request
    if (holding.user.toString() !== userId) {
      return res.status(403).json({ success: false, error: "Not authorized to sell this holding." });
    }
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // 2. Check if user has enough shares to sell
    if (holding.shares < shares) {
      return res.status(400).json({ success: false, error: `Insufficient shares. You only hold ${holding.shares}.` });
    }

    // 3. Calculate proceeds (selling at original purchase price for simplicity)
    const proceeds = shares * holding.purchasePrice;

    // 4. Add proceeds to user balance
    user.virtualBalance += proceeds;
    await user.save();

    // 5. Update or delete holding
    holding.shares -= parseInt(shares);
    if (holding.shares === 0) {
      await PortfolioHolding.deleteOne({ _id: holdingId });
    } else {
      await holding.save();
    }

    res.status(200).json({ success: true, data: { message: "Sale successful", newBalance: user.virtualBalance } });

  } catch (error) {
    console.error("Error selling IPO holding:", error);
    res.status(500).json({ success: false, error: "Server Error during sale." });
  }
};
