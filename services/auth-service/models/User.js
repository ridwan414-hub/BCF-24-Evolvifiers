const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bookedSeats: {
        ref: 'Seat',
        type: mongoose.Schema.Types.ObjectId
    },
    contactNumber: {
        type: String
    }
});

module.exports = mongoose.model('User', UserSchema);
