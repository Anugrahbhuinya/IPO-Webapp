const express = require("express");
const {
  getInvestors,
  getInvestor,
  createInvestor,
  updateInvestor,
  deleteInvestor,
} = require("../controllers/investorController");

const { protect, authorize } = require("../middleware/authMiddleware");
const { handleValidationErrors } = require("../middleware/validationMiddleware");
const { investorValidationRules } = require("../middleware/resourceValidationMiddleware");

const router = express.Router();

// Public routes
router.route("/").get(getInvestors);
router.route("/:id").get(getInvestor);

// Private/Admin routes with validation
router.route("/").post(
    protect, 
    authorize("admin"), 
    investorValidationRules(), 
    handleValidationErrors, 
    createInvestor
);
router.route("/:id").put(
    protect, 
    authorize("admin"), 
    investorValidationRules(), 
    handleValidationErrors, 
    updateInvestor
);
router.route("/:id").delete(protect, authorize("admin"), deleteInvestor);

module.exports = router;

