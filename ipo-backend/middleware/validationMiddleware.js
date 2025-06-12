const { body, validationResult } = require("express-validator");

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format errors to be more readable if desired
    const formattedErrors = errors.array().map(err => ({ msg: err.msg, param: err.path }));
    return res.status(400).json({ success: false, errors: formattedErrors });
  }
  next();
};

// Validation rules for registration
const registerValidationRules = () => {
  return [
    body("name", "Name is required").not().isEmpty().trim().escape(),
    body("email", "Please include a valid email").isEmail().normalizeEmail(),
    body("password", "Password must be 6 or more characters").isLength({ min: 6 }),
  ];
};

// Validation rules for login
const loginValidationRules = () => {
  return [
    body("email", "Please include a valid email").isEmail().normalizeEmail(),
    body("password", "Password is required").exists(),
  ];
};

module.exports = {
  handleValidationErrors,
  registerValidationRules,
  loginValidationRules,
};

