const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
    trainNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    availableSeats: { type: Number, required: true },
    price: { type: Number, required: true },
});

const Train = mongoose.model('Train', trainSchema);
module.exports = Train;
