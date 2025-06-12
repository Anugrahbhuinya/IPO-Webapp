const express = require("express");
const {
  getBrokers,
  getBroker,
  createBroker,
  updateBroker,
  deleteBroker,
  compareBrokers
} = require("../controllers/brokerController");

const { protect, authorize } = require("../middleware/authMiddleware");
const { handleValidationErrors } = require("../middleware/validationMiddleware");
const { brokerValidationRules } = require("../middleware/resourceValidationMiddleware");

const router = express.Router();

// Public routes
router.route("/").get(getBrokers);
router.route("/compare").get(compareBrokers);
router.route("/:id").get(getBroker);

// Private/Admin routes with validation
router.route("/").post(
    protect, 
    authorize("admin"), 
    brokerValidationRules(), 
    handleValidationErrors, 
    createBroker
);
router.route("/:id").put(
    protect, 
    authorize("admin"), 
    brokerValidationRules(), 
    handleValidationErrors, 
    updateBroker
);
router.route("/:id").delete(protect, authorize("admin"), deleteBroker);

module.exports = router;

