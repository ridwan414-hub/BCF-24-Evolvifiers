const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    bookingId: { type: String, required: true },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
