const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const db = require('./db');

// Middleware
app.use(express.json());
const allowedOrigins = process.env.FRONTEND_URL?.split(',') || [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
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
  const baseUrl = process.env.VITE_BASE_URL || `http://localhost:${PORT}`;
  console.log(`✅ Server running on ${baseUrl}`);
});
