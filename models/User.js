const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    id: { type: String },
}, {
    timestamp: true,
});

module.exports = mongoose.model("User", UserSchema);