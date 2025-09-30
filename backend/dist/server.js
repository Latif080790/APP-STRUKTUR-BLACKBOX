"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
// Simple logger replacement
const logger = {
    info: console.log,
    error: console.error,
    warn: console.warn
};
// Simple error handler
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
};
// Simple request logger
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });
    next();
};
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const projects_1 = __importDefault(require("./routes/projects"));
const analysis_1 = __importDefault(require("./routes/analysis"));
const materials_1 = __importDefault(require("./routes/materials"));
const bim_1 = __importDefault(require("./routes/bim"));
const ai_1 = __importDefault(require("./routes/ai"));
const performance_1 = __importDefault(require("./routes/performance"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:8082",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});
exports.io = io;
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:8082",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Compression middleware
app.use((0, compression_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: 'Terlalu banyak request dari IP ini, coba lagi nanti.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
// Body parsing middleware
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// Request logging
app.use(requestLogger);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0'
    });
});
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/analysis', analysis_1.default);
app.use('/api/materials', materials_1.default);
app.use('/api/bim', bim_1.default);
app.use('/api/ai', ai_1.default);
app.use('/api/performance', performance_1.default);
// API Documentation
app.use('/api/docs', express_1.default.static('docs'));
// Socket.IO for real-time updates
io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);
    // Join project room for collaborative features
    socket.on('join-project', (projectId) => {
        socket.join(`project-${projectId}`);
        logger.info(`User ${socket.id} joined project ${projectId}`);
    });
    // Real-time analysis updates
    socket.on('analysis-update', (data) => {
        socket.to(`project-${data.projectId}`).emit('analysis-updated', data);
    });
    // Performance monitoring updates
    socket.on('performance-data', (data) => {
        socket.to(`project-${data.projectId}`).emit('performance-updated', data);
    });
    socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.id}`);
    });
});
// Error handling middleware (must be last)
app.use(errorHandler);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint tidak ditemukan',
        path: req.originalUrl
    });
});
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    logger.info(`🚀 Server berjalan di port ${PORT}`);
    logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
    logger.info(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});
//# sourceMappingURL=server.js.map