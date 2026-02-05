/**
 * Route Index
 * Aggregates all routes
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const noteRoutes = require('./noteRoutes');
const bookmarkRoutes = require('./bookmarkRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/notes', noteRoutes);
router.use('/bookmarks', bookmarkRoutes);

// Health check
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running (in-memory mode)',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
