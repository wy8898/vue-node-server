var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var produtList = new Schema({
    "productId":{type:String},
    "productName":String,
    "productPrice":Number,
    "productImg":String,
    "checked":String,
    "productNum":Number
})

module.exports = mongoose.model('Product',produtList);

