/**
 * Notes & Bookmarks API Server
 * Entry point for the application
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes and middleware
const routes = require('./src/routes');
const { errorHandler } = require('./src/middleware/errorHandler');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api', routes);

// Welcome route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Notes & Bookmarks API (In-Memory Mode)',
        version: '1.0.0',
        docs: {
            notes: '/api/notes',
            bookmarks: '/api/bookmarks',
            auth: '/api/auth',
            health: '/api/health'
        }
    });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
🚀 Server running on port ${PORT}
📝 Notes API: http://localhost:${PORT}/api/notes
🔖 Bookmarks API: http://localhost:${PORT}/api/bookmarks
🔐 Auth API: http://localhost:${PORT}/api/auth
❤️  Health: http://localhost:${PORT}/api/health
⚠️  In-memory mode - data lost on restart
    `);
});

module.exports = app;
