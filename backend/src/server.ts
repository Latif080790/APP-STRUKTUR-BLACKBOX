import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
// Simple logger replacement
const logger = {
  info: console.log,
  error: console.error,
  warn: console.warn
};

// Simple error handler
const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
};

// Simple request logger
const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
};

// Routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import analysisRoutes from './routes/analysis';
import materialRoutes from './routes/materials';
import bimRoutes from './routes/bim';
import aiRoutes from './routes/ai';
import performanceRoutes from './routes/performance';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:8082",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Security middleware
app.use(helmet({
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
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8082",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Terlalu banyak request dari IP ini, coba lagi nanti.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/bim', bimRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/performance', performanceRoutes);

// API Documentation
app.use('/api/docs', express.static('docs'));

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

export { io };