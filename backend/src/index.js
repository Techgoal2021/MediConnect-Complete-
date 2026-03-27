const express = require('express');
// require('cors'); // Removed due to environment constraints
require('dotenv').config();

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('MediConnect API is running...');
  console.log(`Server running on port ${PORT}`);
});
