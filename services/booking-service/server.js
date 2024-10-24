require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/database');
const bookingRoutes = require('./routes/bookingRoutes');
const BookingConsumer = require('./consumers/bookingConsumer');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(morgan('tiny'));

// Routes
app.use('/api', bookingRoutes);

// Start the booking consumer
BookingConsumer.start();

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`Booking Service running on port ${PORT}`);
});