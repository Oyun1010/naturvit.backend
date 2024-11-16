const mongoose = require('mongoose');

const User = mongoose.model("users", new mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String },
}));

module.exports = User;