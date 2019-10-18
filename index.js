var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var products = require('./routes/product');
var user = require('./routes/user');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser());

// app.use(function (req,res,next) {
//     if(req.cookies.userId){
//         next()
//     }else{
//         if(req.originalUrl == "/user/login" || req.originalUrl == "/user/logout" || req.originalUrl.indexOf("/product/list") > -1){
//             next()
//         }else{
//             res.json({
//                 status:200,
//                 msg:'当前用户未登录',
//                 result:null
//             })
//         }
//     }
// })

app.use('/product', products);
app.use('/user', user);


app.get('/', function( req, res) {
    res.json({
        success: false,
        code: 404,
        msg: "未定义的接口，请检查url地址是否正确",
        data: null
    })
}).listen(3000);

module.exports = app;
