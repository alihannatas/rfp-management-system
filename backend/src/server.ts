import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
// import { generalRateLimiter } from './middleware/rateLimiter';

// Import routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import productRoutes from './routes/products';
import rfpRoutes from './routes/rfps';
import proposalRoutes from './routes/proposals';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      config.corsOrigin
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Rate limiting - DISABLED
// app.use(generalRateLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', productRoutes);
app.use('/api/projects', rfpRoutes);
app.use('/api/proposals', proposalRoutes);

// Public routes for suppliers (no authentication required)
app.get('/api/rfps/active', async (req, res) => {
  try {
    const { RFPController } = await import('./controllers/rfpController');
    await RFPController.getActiveRFPs(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

app.get('/api/rfps/:rfpId', async (req, res) => {
  try {
    const { RFPController } = await import('./controllers/rfpController');
    await RFPController.getRFPByIdForSupplier(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🌐 CORS Origin: ${config.corsOrigin}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
});

export default app;
