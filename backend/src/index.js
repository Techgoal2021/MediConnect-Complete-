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

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/specialists', require('./routes/specialists'));
app.use('/api/payments', require('./routes/payments'));

app.get('/', (req, res) => {
  res.send('MediConnect API is running...');
});

// For Vercel Serverless Functions
module.exports = app;

// Only listen if not running as a Vercel function
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
