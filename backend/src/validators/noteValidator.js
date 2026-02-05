/**
 * Note Validators
 * Input validation for note endpoints
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
 * Create note validation rules
 */
const createNoteRules = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('content')
        .trim()
        .notEmpty().withMessage('Content is required'),
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
 * Update note validation rules
 */
const updateNoteRules = [
    param('id')
        .notEmpty().withMessage('Note ID is required'),
    body('title')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('content')
        .optional()
        .trim(),
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

module.exports = { createNoteRules, updateNoteRules, idParamRules };
