const express = require('express');
const morgan = require('morgan');
const trainRoutes = require('./routes/trainRoutes');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(morgan('tiny'));


app.get('/health', (req, res) => {
    res.status(200).send('Train Service is running');
});

app.use('/api/trains', trainRoutes);

app.listen(PORT, () => {
    console.log(`Train Service running on port ${PORT}`);
});
