require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const googleAuthRoutes = require('./routes/googleAuth');
const authRoutes = require('./routes/authRoutes');
const { checkUserStatus } = require('./middleware/checkUserStatus');
const getUserStatusRoutes = require('./routes/get-user-status');
const meetingsRoute = require('./routes/meetings');
const connectDB = require("./config/db");
const sessionRoutes = require('./routes/session.routes');
require("./jobs/sessionQueue"); 
require("./jobs/sessionCronJob"); 
require('./jobs');


const app = express();

// ======= Environment Validation =======
if (!process.env.DATABASE_URI || !process.env.JWT_SECRET) {
    console.error('Missing required environment variables. Check .env file.');
    process.exit(1);
}

// Connect to Database
connectDB();

// ======= Middleware =======
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,  // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
});
app.use(limiter);

// Body Parser Middleware
app.use(express.json());

// CORS Middleware
app.use(cors({
    origin: 'http://localhost:5000', // Update if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(morgan('dev'));
app.options('*', cors()); // Handle preflight requests

// ======= Routes =======
app.get('/', (req, res) => {
    res.send('<h1>Welcome to Masai Connect Backend</h1>');
});

app.get('/api/health', async (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({ status: 'OK', message: 'Server is running smoothly', dbStatus });
});

app.use('/api/auth', authRoutes);
app.use(checkUserStatus);
app.use('/api/google', googleAuthRoutes);
app.use('/api', getUserStatusRoutes);
app.use('/api/meetings', meetingsRoute);
app.use('/api/sessions', sessionRoutes);

app.get('/api/dashboard', (req, res) => {
    res.json({ message: 'Welcome to your dashboard!' });
});

// ======= 404 Handler =======
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// ======= Global Error Handler =======
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// ======= Start Server =======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ======= Graceful Shutdown =======
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await mongoose.disconnect();
    process.exit(0);  // Fixed Typo (process. Exit → process.exit)
});
