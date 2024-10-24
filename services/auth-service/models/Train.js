const mongoose = require('mongoose');

const TrainSchema = new mongoose.Schema({
    trainName: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    ticketPrice: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Train', TrainSchema);
