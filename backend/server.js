const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const db = require('./db');

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, // If using cookies or authorization headers
}));

// Health check or root route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Routers
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

// Start server
// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  const baseUrl = process.env.REACT_BASE_URL || `http://localhost:${PORT}`;
  console.log(`✅ Server running on ${baseUrl}`);
});
