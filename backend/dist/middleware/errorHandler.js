"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    // Log error
    console.error('Error:', err);
    // Default error
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Server Error';
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        message = 'Resource tidak ditemukan';
        statusCode = 404;
    }
    // Mongoose duplicate key
    if (err.name === 'MongoError' && err.code === 11000) {
        message = 'Duplicate field value entered';
        statusCode = 400;
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        message = 'Validation Error';
        statusCode = 400;
    }
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map