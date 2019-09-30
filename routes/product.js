var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Products = require('../models/product');

//连接mongodb数据库
mongoose.connect('mongodb://127.0.0.1:27017/vueNode');

mongoose.connection.on("connected", function () {
    console.log("mongdb 数据库连接成功");
});

mongoose.connection.on("error", function () {
    console.log("mongdb 数据库连接失败");
});

mongoose.connection.on("disconnected", function () {
    console.log("mongdb 数据库连接断开");
});

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get("/", function (req, res) {
    //获取前端传的数据
    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let sort = req.param("sort");

    //分页
    let skip = (page - 1) * pageSize;

    let params = {};
    let productModel = Products.find(params).skip(skip).limit(pageSize);
    productModel.sort({"price": sort});
    productModel.exec({}, function (err, doc) {
        if (err) {
            res.json({
                status: 1,
                msg: err.message
            })
        } else {
            res.json({
                status: 0,
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
});

module.exports = app;
