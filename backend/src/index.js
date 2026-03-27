const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

// Request Logger (Debug ONLY - help us see what Vercel passes)
app.use((req, res, next) => {
  console.log(`[BACKEND DEBUG] ${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/specialists', require('./routes/specialists'));
app.use('/api/payments', require('./routes/payments'));

app.get('/api/status', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'MediConnect API is running...',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

app.get('/', (req, res) => {
  res.send('MediConnect API is running...');
});

// JSON 404 Catch-all (helps distinguish Vercel 404 from Backend 404)
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found in MediConnect Backend: ${req.originalUrl}`,
    help: "If you see this, the request reached the backend but the path didn't match any route."
  });
});

// For Vercel Serverless Functions
module.exports = app;

// Only listen if not running as a Vercel function
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
