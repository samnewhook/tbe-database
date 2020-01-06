const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, default: "basic", enum: ["basic", "admin"], required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);