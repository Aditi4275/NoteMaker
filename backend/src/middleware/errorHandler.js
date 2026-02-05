/**
 * Custom API Error class
 * Provides consistent error structure across the application
 */

class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message = 'Bad Request') {
        return new ApiError(message, 400);
    }

    static unauthorized(message = 'Unauthorized') {
        return new ApiError(message, 401);
    }

    static notFound(message = 'Not Found') {
        return new ApiError(message, 404);
    }

    static internal(message = 'Internal Server Error') {
        return new ApiError(message, 500);
    }
}

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging
    if (process.env.NODE_ENV !== 'production') {
        console.error('Error:', err.message);
        if (err.stack) console.error(err.stack);
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};

module.exports = { ApiError, errorHandler };
