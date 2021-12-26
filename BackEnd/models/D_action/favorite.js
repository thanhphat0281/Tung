const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
    cakeID: String,
    userID: String,
});

module.exports = mongoose.model('favorites', favoriteSchema);