var mongoose = require('mongoose');
var userList = new mongoose.Schema({
    "userId":String,
    "userName":String,
    "userPwd":String,
    "orderList":Array,
    "cartList":[{
        "productId":String,
        "productName":String,
        "productPrice":String,
        "productImg":String,
        "checked":String,
        "productNum":Number
    }],
    "addressList":Array
});

module.exports = mongoose.model('User',userList);
