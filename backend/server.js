const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Load env
dotenv.config();

// Connect DB
connectDB();

const app = express();

// ✅ CORS FIX (IMPORTANT)
app.use(cors({
  origin: [
    "http://localhost:5173", // for local testing
    "https://employment-portal-chi.vercel.app" // your frontend
  ],
  credentials: true
}));

// Middlewares
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
