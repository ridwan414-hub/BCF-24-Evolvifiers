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
            train_id: { type: String },
            seat_id: { type: String }
        }
    ],
    contactNumber: {
        type: String
    }
});

module.exports = mongoose.model('User', UserSchema);
