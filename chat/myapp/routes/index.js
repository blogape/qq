var express = require("express");
var router = express.Router();
const mysql = require("mysql");
var db = require("../database/db.js");
var token = require("../models/token.js");

var user = require("../database/user.js");
var connection = mysql.createConnection(db.mysql);
connection.connect();

/* GET home page. */
router.post("/login", function(req, res, next) {
  //用于生成uuid
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  function guid() {
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  }
  let uuid = "cms" + guid();


  //生成头像随机数 0-40个头像随机数

  function random() {
    return Math.floor(Math.random() * (0 - 40)) + 0;
  }

  var numabs= Math.abs(random());
  var randomnumber;
  if(numabs<10){
    randomnumber='0'+'0'+numabs
  }else{
    randomnumber='0'+numabs
  }
  var headurl='https://blogape.oss-cn-shenzhen.aliyuncs.com/qq/'+randomnumber+'.png';
  
  // Math.abs(

  // 查询是否注册
  connection.query(user.getUserByEmail, req.body.userName, (err, result) => {
   //如果没有注册 0为没有注册
    if (result.length == 0) {
      // 去注册一个
      connection.query(
        user.insert,
        [req.body.userName, req.body.password,headurl],
        (err, result) => {
          // 注册完成 用户信息查询出来登录
          connection.query(user.getUserByEmail, req.body.userName, (err, result) => {
           //生成的uuid
         if (err) throw err;
         console.log(result[0]);
              const usertoken=new token({
                token:uuid,
                email:result[0].userName,
              })
              usertoken.save((err,data)=>{
                console.log(data);
                if(err){
                  console.log(err);
                }else{
                  console.log('验证成功');
                }
              })
           res.send({
             code:0,
             data:{
               headimg: result[0].headimg,
               token: uuid,
               username: result[0].email
             }
           })
          })
        }
      );
    } else {
        if(req.body.password!=result[0].password){
          res.send({
            code: 1,
            data: {
            },
            msg:'密码错误'
          });
        }else{
          //redis 添加缓存
          const usertoken=new token({
            token:uuid,
            email:result[0].email,
          })
          usertoken.save((err,data)=>{
            if(err){
              console.log(err);
            }else{
              console.log('验证成功');
            }
          })
          res.send({
            code: 0,
            data: {
              headimg: "",
              token: uuid,
              username: result[0].email
            }
          });
        }
     
    }
  });
  console.log(req.body);
});

module.exports = router;
