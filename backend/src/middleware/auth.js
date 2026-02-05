/**
 * Authentication Middleware
 * Verifies tokens and attaches user to request
 */

const store = require('../data/store');
const { decodeToken } = require('../utils/helpers');
const { ApiError } = require('./errorHandler');

/**
 * Protect routes - requires valid token
 */
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(ApiError.unauthorized('Not authorized - no token provided'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = decodeToken(token);

    if (!decoded) {
        return next(ApiError.unauthorized('Not authorized - invalid or expired token'));
    }

    const user = store.users.find(u => u._id === decoded.id);
    if (!user) {
        return next(ApiError.unauthorized('Not authorized - user not found'));
    }

    // Attach user to request (without password)
    req.user = {
        _id: user._id,
        name: user.name,
        email: user.email
    };

    next();
};

/**
 * Optional auth - attaches user if token present, but doesn't require it
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = decodeToken(token);

        if (decoded) {
            const user = store.users.find(u => u._id === decoded.id);
            if (user) {
                req.user = {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                };
            }
        }
    }

    next();
};

module.exports = { protect, optionalAuth };
