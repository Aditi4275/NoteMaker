/**
 * Helper utilities
 * ID generation, token handling, password hashing
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Generate a unique ID
 * @returns {string} Unique identifier
 */
const generateId = () => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

/**
 * Generate a JWT token
 * @param {string} userId - User ID to encode
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d'
    });
};

/**
 * Decode and verify a JWT token
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload or null if invalid
 */
const decodeToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    } catch (error) {
        return null;
    }
};

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {string} Hashed password
 */
const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {boolean} True if match
 */
const comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

module.exports = {
    generateId,
    generateToken,
    decodeToken,
    hashPassword,
    comparePassword
};
