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
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By", ' 3.2.1');
    // res.header("Content-Type", "application/json;charset=utf-8");

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    next();
});

app.get("/list", function (req, res) {

    //获取前端传的数据
    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let sort = req.param("sort");
    let priceMin = req.param("priceMin");
    let priceMax = req.param("priceMax");
    let params = {};

    //分页
    let skip = (page - 1) * pageSize;

    //筛选
    if(priceMin !== undefined && priceMax !== undefined){
        params = {
            productPrice:{
                $gt:Number(priceMin),
                $lte:Number(priceMax)
            }
        }
    }

    let productModel = Products.find(params).skip(skip).limit(pageSize);
    if(sort !== undefined){
        productModel.sort({"productPrice": sort});
    }

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

//加入到购物车
app.post("/addCart", function (req, res, next) {
    var userId = req.body.userId,productId = req.body.productId;
    var User = require('../models/user');

    User.findOne({userId:userId},function (err,userDoc) {
        if(err){
            res.json({
                status:1,
                msg:err.message
            })
        }else{
            if(userDoc){
                var productsItem = "";
                userDoc.cartList.forEach(function (item) {
                    if(item.productId == productId){
                        productsItem = item;
                        item.productNum ++;
                    }
                })

                if(productsItem){
                    userDoc.save(function (err2,doc2) {
                        if(err2){
                            res.json({
                                status:1,
                                msg:err2.message
                            })
                        }else{
                            res.json({
                                status:0,
                                msg:'添加购物车成功',
                                result:'succes'
                            })
                        }
                    })
                }else{
                    Products.findOne({productId:productId},function (err1,doc) {
                        if(err1){
                            res.json({
                                status:1,
                                msg:err1.message
                            })
                        }else{
                            if(doc){
                                doc.productNum = 1;
                                doc.checked = 1;
                                console.log(doc)
                                userDoc.cartList.push(doc);
                                userDoc.save(function (err2,doc2) {
                                    if(err2){
                                        res.json({
                                            status:1,
                                            msg:err2.message
                                        })
                                    }else{
                                        res.json({
                                            status:0,
                                            msg:'',
                                            result:'succes'
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
        }
    })
})
module.exports = app;
