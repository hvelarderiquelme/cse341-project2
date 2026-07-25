// middleware/bookValidationRules.js
const { body } = require('express-validator');

const bookValidationRules = [
  // 1. Title Validation & Sanitization
  body('title')
    .notEmpty().withMessage('Title must be a non-empty string.')
    .isString().withMessage('Title must be a non-empty string.')
    .trim(),

  // 2. Author Validation & Sanitization
  body('author')
    .notEmpty().withMessage('Author must be a non-empty string.')
    .isString().withMessage('Author must be a non-empty string.')
    .trim(),

  // 3. Published Year Validation
  body('published_year')
    .isInt({ min: 0, max: new Date().getFullYear() })
    .withMessage(`Publish year must be a 4 digit valid year. No greater than ${new Date().getFullYear()}.`),

  // 4. Genres Array Validation & Sanitization
  body('genres')
    .isArray({ min: 1 }).withMessage('Genres must be an array of non-empty strings.')
    .custom((genresArray) => {
      // Replicates your constraint: every item in array must be a non-empty string
      const allValid = genresArray.every(g => typeof g === 'string' && g.trim() !== '');
      if (!allValid) {
        throw new Error('Genres must be an array of non-empty strings.');
      }
      return true;
    })
    // Replicates your trim logic for every entry in the array
    .customSanitizer((genresArray) => {
      return Array.isArray(genresArray) ? genresArray.map(g => g.trim()) : genresArray;
    }),

  // 5. ISBN Validation & Sanitization
  body('isbn')
    .notEmpty().withMessage('ISBN number must be a non-empty string.')
    .isString().withMessage('ISBN number must be a non-empty string.')
    .trim(),

  // 6. Base Stock Object Validation
  body('stock')
    .isObject().withMessage('Stock must be a valid object. Check swagger configuration.')
    .custom((value) => {
      // Replicates your structural block checking null/array states explicitly
      if (value === null || Array.isArray(value)) {
        throw new Error('Stock must be a valid object. Check swagger configuration.');
      }
      return true;
    }),

  // 7. Stock Available Sub-Property Validation
  body('stock.available')
    .isInt({ min: 0 }).withMessage('Stock available must be a number greater or equal to 0.'),

  // 8. Stock Location Sub-Property Validation & Sanitization
  body('stock.location')
    .isString().withMessage('Location must be a non-empty string.')
    .notEmpty().withMessage('Location must be a non-empty string.')
    .trim(),

  // 9. Safety Sanitizer: Completely strip out _id if sent in req.body
  body('_id').customSanitizer(() => undefined)
];

module.exports = {
  bookValidationRules
};