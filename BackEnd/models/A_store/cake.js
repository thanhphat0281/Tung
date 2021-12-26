 const mongoose = require('mongoose');

 const cakeSchema = mongoose.Schema({
     nameCake: String,
     categoryID: String,
     priceCake: Number,
     detailCake: String,
     imgCake: String,
     sale: Number,
     quantity: Number,
     rate: Object,
 });

 module.exports = mongoose.model('cakes', cakeSchema);