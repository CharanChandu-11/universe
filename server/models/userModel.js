const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    collegeName: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: String, required: true },
    bio: { type: String, default: "" },
    file: { type: String, default: "" },
});
const User = mongoose.model('User', userSchema);
module.exports = User;


