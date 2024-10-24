const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
    userId: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId
    },
    trainId: {
        ref: 'Train',
        type: mongoose.Schema.Types.ObjectId
    },
    seatStatus: {
        type: String,
        enum: ['true', 'false', 'pending'],
        default: 'false'
    }
});

module.exports = mongoose.model('Seat', SeatSchema);
