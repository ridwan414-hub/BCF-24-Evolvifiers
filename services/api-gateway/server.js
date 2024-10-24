const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const authMiddleware = require('./middleware/authMiddleware');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const authServiceProxy = createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true
});
const trainServiceProxy = createProxyMiddleware({
    target: process.env.TRAIN_SERVICE_URL,
    changeOrigin: true
});
const bookingServiceProxy = createProxyMiddleware({
    target: process.env.BOOKING_SERVICE_URL,
    changeOrigin: true
});
const ticketServiceProxy = createProxyMiddleware({
    target: process.env.TICKET_SERVICE_URL,
    changeOrigin: true
});
// Routes
app.use('/api/auth', authServiceProxy);

// Protected Routes
app.use('/api/trains', authMiddleware, trainServiceProxy);
app.use('/api/bookings', authMiddleware, bookingServiceProxy);
app.use('/api/tickets', authMiddleware, ticketServiceProxy);


app.get('/health', (req, res) => {
    res.json({ message: "API Gateway is Perfectly Running !" });
});
// Start the server
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
