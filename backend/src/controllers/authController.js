/**
 * Auth Controller
 * Handles user registration, login, and profile
 */

const store = require('../data/store');
const { generateId, generateToken, hashPassword, comparePassword } = require('../utils/helpers');
const { ApiError } = require('../middleware/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = store.users.find(u => u.email === email.toLowerCase());
    if (existingUser) {
        throw ApiError.badRequest('User already exists with this email');
    }

    // Create user
    const user = {
        _id: generateId(),
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashPassword(password),
        createdAt: new Date().toISOString()
    };

    store.users.push(user);

    res.status(201).json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        }
    });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = store.users.find(u => u.email === email.toLowerCase());

    if (!user || !comparePassword(password, user.password)) {
        throw ApiError.unauthorized('Invalid credentials');
    }

    res.status(200).json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        }
    });
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user
    });
});

module.exports = { register, login, getMe };
