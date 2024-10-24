const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    trainId: { type: String, required: true },
    userId: { type: String, required: true },
    seatNumber: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;