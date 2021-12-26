const mongoose = require('mongoose');

const datasetRecommendSchema = mongoose.Schema({
    cakeID: String,
    userID: String,
    rate: Number,
    buy: Number,
    click: Number,
    //
    categoryID: String,
    priceCake: Number,
    sale: Number,
});

module.exports = mongoose.model('datasetRecommends', datasetRecommendSchema);