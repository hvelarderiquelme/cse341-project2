// middleware/teamValidationRules.js
const { body } = require('express-validator');

const teamValidationRules = [
  // 1. Team Name Validation & Sanitization
  body('team_name')
    .isString().withMessage('Team name must be a non-empty string.')
    .notEmpty().withMessage('Team name must be a non-empty string.')
    .trim(),

  // 2. Country Code Validation & Sanitization
  body('country_code')
    .isString().withMessage('Country code must be a non-empty string.')
    .notEmpty().withMessage('Country code must be a non-empty string.')
    .trim(),

  // 3. Confederation Validation & Sanitization
  body('confederation')
    .isString().withMessage('Confederation must be a non-empty string.')
    .notEmpty().withMessage('Confederation must be a non-empty string.')
    .trim(),

  // 4. Rank Validation
  body('rank')
    .isInt({ min: 1 }).withMessage('Rank must be an integer number greater than 0.'),

  // 5. Stats Object Validation
  body('stats')
    .isObject().withMessage('Stats must be a valid object. Check Swagger configuration.')
    .custom((value) => {
      if (value === null || Array.isArray(value)) {
        throw new Error('Stats must be a valid object. Check Swagger configuration.');
      }
      return true;
    }),

  // 6. Stats points sub-property validation
  body('stats.points')
    .isFloat({ min: 0 }).withMessage('Points must be a valid number equal or greater than 0.'),

  // 7. Stats previous_rank sub-property validation
  body('stats.previous_rank')
    .isInt({ min: 1 }).withMessage('Previous rank must be an integer number greater than 0.'),

  // 8. Key Players Array Validation & Sanitization
  body('key_players')
    .isArray({ min: 1 }).withMessage('Key players must be an array of non-empty strings.')
    .custom((playersArray) => {
      const allValid = playersArray.every(p => typeof p === 'string' && p.trim() !== '');
      if (!allValid) {
        throw new Error('Key players must be an array of non-empty strings.');
      }
      return true;
    })
    .customSanitizer((playersArray) => {
      return Array.isArray(playersArray) ? playersArray.map(p => p.trim()) : playersArray;
    }),

  // 9. Active Status Validation
  body('active')
    .isBoolean().withMessage('Active must be a valid boolean value (true or false).'),

  // 10. Safety Sanitizer: Explicitly remove _id if provided in the payload
  body('_id').customSanitizer(() => undefined)
];

module.exports = {
  teamValidationRules
};