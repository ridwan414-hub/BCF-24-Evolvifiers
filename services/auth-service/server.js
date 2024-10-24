const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const morgan = require('morgan');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('tiny'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('Auth Service is running');
});

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
