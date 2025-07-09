const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const db = require('./db');
// const bodyParser = require('body-parser'); 

// Middleware
// app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, // If using cookies or authorization headers
}));

// Routers
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
