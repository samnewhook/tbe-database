const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    title: { type: String, required: true},
    content: { type: String, required: true}
});

module.exports = mongoose.model('Item', itemSchema);