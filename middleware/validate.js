// middleware/validate.js
const { validationResult } = require('express-validator');

/**
 * Reusable middleware that checks if express-validator found any issues.
 * If errors exist, it immediately halts the request and returns a clean 422 Unprocessable Entity status.
 */
const validatePayload = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Validation failed.',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = { validatePayload };