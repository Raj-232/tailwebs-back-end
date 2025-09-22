const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require("./config/db");

// Import routes
const authRoutes = require('./routes/auth');
const assignmentRoutes = require('./routes/assignments');

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });
connectDB();

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// Configure CORS with options
app.use(cors({
    origin: 'http://localhost:5173', // Allow only specific origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true // Allow cookies and authentication headers
  }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
