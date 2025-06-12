const { body } = require("express-validator");

// Add more specific validation rules as needed

const ipoValidationRules = () => {
  return [
    body("companyName", "Company name is required").not().isEmpty().trim().escape(),
    body("symbol", "Stock symbol is required").not().isEmpty().trim().escape().toUpperCase(),
    body("description", "Description is required").not().isEmpty().trim().escape(),
    body("ipoDate", "Valid IPO date is required").isISO8601().toDate(),
    body("priceRangeLow", "Price range low must be a number").optional().isNumeric(),
    body("priceRangeHigh", "Price range high must be a number").optional().isNumeric(),
    body("sharesOffered", "Shares offered must be a number").optional().isNumeric(),
    body("status", "Invalid status").optional().isIn(["upcoming", "active", "past", "cancelled"]),
  ];
};

const brokerValidationRules = () => {
    return [
        body("name", "Broker name is required").not().isEmpty().trim().escape(),
        body("description", "Description is required").not().isEmpty().trim().escape(),
        body("website", "Valid website URL is required").optional({ checkFalsy: true }).isURL(),
        body("rating", "Rating must be between 0 and 5").optional().isFloat({ min: 0, max: 5 }),
        // Add validation for fees, features if needed
    ];
};

const investorValidationRules = () => {
    return [
        body("name", "Investor name is required").not().isEmpty().trim().escape(),
        body("investorType", "Invalid investor type").optional().isIn(["individual", "venture_capital", "angel", "institutional", "other"]),
        body("website", "Valid website URL is required").optional({ checkFalsy: true }).isURL(),
    ];
};


module.exports = {
  ipoValidationRules,
  brokerValidationRules,
  investorValidationRules
};

