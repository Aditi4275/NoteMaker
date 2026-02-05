/**
 * Auth Validators
 * Input validation for authentication endpoints
 */

const { body, validationResult } = require('express-validator');
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
 * Register validation rules
 */
const registerRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleValidation
];

/**
 * Login validation rules
 */
const loginRules = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required'),
    handleValidation
];

module.exports = { registerRules, loginRules };
