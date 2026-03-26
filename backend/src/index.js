const express = require('express');
// require('cors'); // Removed due to environment constraints
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Manual CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/specialists', require('./routes/specialists'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/reviews', require('./routes/reviews'));

app.get('/', (req, res) => {
  res.send('MediConnect API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
