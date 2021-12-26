const mongoose = require('mongoose');

const cartCakeSchema = mongoose.Schema({
    cakeID: String,
    count: Number,
    userID: String,
});

module.exports = mongoose.model('cartCakes', cartCakeSchema);