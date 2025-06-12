const express = require("express");
const {
  getIPOs,
  getIPO,
  createIPO,
  updateIPO,
  deleteIPO,
} = require("../controllers/ipoController");

const { protect, authorize } = require("../middleware/authMiddleware");
const { handleValidationErrors } = require("../middleware/validationMiddleware");
const { ipoValidationRules } = require("../middleware/resourceValidationMiddleware");

const router = express.Router();

// Public routes
router.route("/").get(getIPOs);
router.route("/upcoming").get(getIPOs); 
router.route("/:id").get(getIPO);

// Private/Admin routes with validation
router.route("/").post(
    protect, 
    authorize("admin"), 
    ipoValidationRules(), 
    handleValidationErrors, 
    createIPO
);
router.route("/:id").put(
    protect, 
    authorize("admin"), 
    ipoValidationRules(), // Apply same rules for update, adjust if needed
    handleValidationErrors, 
    updateIPO
);
router.route("/:id").delete(protect, authorize("admin"), deleteIPO);

module.exports = router;

