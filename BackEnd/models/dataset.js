const mongoose = require('mongoose');

const datasetSchema = mongoose.Schema({
    name: String,
    cake: String,
    rate: Number
});

module.exports = mongoose.model('datasets', datasetSchema);