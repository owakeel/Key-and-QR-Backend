import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
// import keyRoutes from './routes/keyRoutes.js';
// import qrRoutes from './routes/qrRoutes.js';
// import authRoutes from './routes/authRoutes.js';

// Import middleware
import globalErrorHandler from './middleware/errorHandler.js';
import corsOptions from './middleware/cors.js';

// Import utils
import AppError from './utils/appError.js';

dotenv.config();

const app = express();

// CORS Configuration
app.use(cors(corsOptions));

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/api/v1/keys', keyRoutes);
// app.use('/api/v1/qr', qrRoutes);
// app.use('/api/v1/auth', authRoutes);

// Health check
app.get('/api/up', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running healthy!',
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "🚀 Key & QR Backend is running smoothly!",
    server: {
      status: "healthy",
      uptime: process.uptime().toFixed(0) + " seconds",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString()
    },
    author: "🧑‍💻 Owakeel Ahmmed",
    version: "1.0.0"
  });
});


// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export default app;