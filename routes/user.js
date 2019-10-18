var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var User = require('../models/user');
app.use(cookieParser());

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

//登录
app.post("/login", function (req, res, next) {
    var userName = req.body.name,
        userPwd = req.body.password;

    User.findOne({userName:userName,userPwd:userPwd},function (err,doc) {
        if(err){
            res.json({
                status:1,
                msg:err.message
            })
        }else{
            if(doc){
                // res.cookie("userId",doc.userId,{
                //     path:"http://localhost:8080/",
                //     maxAge:1000*60*60
                // });

                res.json({
                    status:0,
                    msg: '',
                    result: {
                        userId:doc.userId,
                        userName:doc.userName
                    }
                })
            }else{
                res.json({
                    status:1,
                    msg: '用户名或密码输入错误'
                })
            }

        }
    })
})

//退出登录
app.post("/logout", function (req, res, next) {
    var userId = req.body.userId;
    res.cookie("userId","",{
        path:"/",
        maxAge:0
    });

    res.json({
        status:0,
        msg: '退出登录成功'
    })

})



module.exports = app;
