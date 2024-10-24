const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const authMiddleware = require('./middleware/authMiddleware');
const promClient = require('prom-client');  // Add this line

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'apigateway_' });

// Create custom metrics
const httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'service', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'service', 'status_code']
});

// Middleware to record metrics
app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    const method = req.method;
    
    // Determine which service is being called
    let service = 'unknown';
    if (path.includes('/api/auth')) service = 'auth';
    if (path.includes('/api/trains')) service = 'train';
    if (path.includes('/api/bookings')) service = 'booking';
    if (path.includes('/api/tickets')) service = 'ticket';

    // Record response metrics after the request is complete
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        httpRequestDuration.labels(method, path, service, res.statusCode).observe(duration);
        httpRequestTotal.labels(method, path, service, res.statusCode).inc();
    });

    next();
});

// Metrics endpoint (add before your proxy routes)
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    const metrics = await promClient.register.metrics();
    res.send(metrics);
});

// Your existing proxy configurations
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
    res.json({ message: "API Gateway is Perfectly Running !!!!!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
    console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});