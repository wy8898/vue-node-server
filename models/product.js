var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var produtList = new Schema({
    "id":{type:String},
    "name":String,
    "price":Number,
    "img":String
})

module.exports = mongoose.model('Product',produtList);

