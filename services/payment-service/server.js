require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/database');
const PaymentConsumer = require('./consumers/paymentConsumer');
const NotificationConsumer = require('./consumers/notificationConsumer');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(morgan('tiny'));

// Start the payment consumer
PaymentConsumer.start();

// Start the notification consumer
NotificationConsumer.start();

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
});
