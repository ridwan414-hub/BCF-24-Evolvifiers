const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
    trainNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    seats: [{
        seatNumber: { type: Number, required: true },
        status: { type: String, enum: ['available', 'booked', 'reserved'], default: 'available' }
    }],
    price: { type: Number, required: true },
});

const Train = mongoose.model('Train', trainSchema);
module.exports = Train;
