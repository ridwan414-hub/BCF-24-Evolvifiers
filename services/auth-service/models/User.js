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
    tickets: [
        {
            train_id: { ref: 'Train', type: mongoose.Schema.Types.ObjectId },
            seat_id: { ref: 'Seat', type: mongoose.Schema.Types.ObjectId }
        }
    ],
    contactNumber: {
        type: String
    }
});

module.exports = mongoose.model('User', UserSchema);
