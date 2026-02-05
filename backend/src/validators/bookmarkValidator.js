/**
 * Bookmark Validators
 * Input validation for bookmark endpoints
 */

const { body, param, validationResult } = require('express-validator');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Handle validation errors
 */
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map(err => err.msg).join(', ');
        return next(ApiError.badRequest(messages));
    }
    next();
};

/**
 * Create bookmark validation rules
 */
const createBookmarkRules = [
    body('url')
        .trim()
        .notEmpty().withMessage('URL is required')
        .isURL({ require_protocol: false }).withMessage('Please provide a valid URL'),
    body('title')
        .optional()
        .trim()
        .isLength({ max: 300 }).withMessage('Title cannot exceed 300 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array'),
    body('tags.*')
        .optional()
        .isString().withMessage('Each tag must be a string')
        .trim()
        .toLowerCase(),
    body('isFavorite')
        .optional()
        .isBoolean().withMessage('isFavorite must be a boolean'),
    handleValidation
];

/**
 * Update bookmark validation rules
 */
const updateBookmarkRules = [
    param('id')
        .notEmpty().withMessage('Bookmark ID is required'),
    body('url')
        .optional()
        .trim()
        .isURL({ require_protocol: false }).withMessage('Please provide a valid URL'),
    body('title')
        .optional()
        .trim()
        .isLength({ max: 300 }).withMessage('Title cannot exceed 300 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array'),
    body('isFavorite')
        .optional()
        .isBoolean().withMessage('isFavorite must be a boolean'),
    handleValidation
];

/**
 * ID param validation
 */
const idParamRules = [
    param('id')
        .notEmpty().withMessage('ID is required'),
    handleValidation
];

module.exports = { createBookmarkRules, updateBookmarkRules, idParamRules };
