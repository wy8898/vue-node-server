var express = require('express');
var products = require('./routes/product');
var app = express();
app.use('/product', products);

app.get('/', function(res, rep) {
    rep.send('Hello, word!');
}).listen(3000);

module.exports = app;
