const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    google_id: {
        type: String,
        required: false
    },
    facebook_id: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Model

mongoose.model('users', userSchema);