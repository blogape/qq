var express = require('express');
var router = express.Router();
const Token=require('../models/token');
const mysql = require("mysql");
var db = require("../database/db.js");
var token = require("../models/token.js");
var user = require("../database/user.js");
var connection = mysql.createConnection(db.mysql);
connection.connect();
/* GET users listing. */
router.post('/', function(req, res, next) {
  let token=req.body.token;
  Token.getByName(token,(data)=>{
    if(data!=null){
        res.send({
          code:0,
          msg:'验证成功'
        })
    }else{
      res.send({
        code:1,
        msg:'验证'
      })
    }
  })
});

//查询所有用户
router.get('/',function(req,res,next){
  console.log(user.queryUser)
  connection.query(user.queryUser,(err,result)=>{
    if(err) return console.error(err);
    console.log(result);
    res.send({
      code:0,
      data:{
        result
      }

    })
  })
})

module.exports = router;
