require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDb } = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/expenses', expenseRoutes);

// Initialize DB and start server
connectToDb((err) => {
  if (!err) {
    app.listen(PORT, () => {
      console.log(`🚀 Server is flying on port ${PORT}`);
    });
  } else {
    console.log('Server failed to start due to database connection error.');
  }
});
