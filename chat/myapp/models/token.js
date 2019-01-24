const redis = require("redis");
const db = redis.createClient(); //创建redis客户端
const mysql = require("mysql");
var datadb = require("../database/db.js");
var user = require("../database/user.js");
var connection = mysql.createConnection(datadb.mysql);
connection.connect();
//通过model 编译模式为模型
const User = require("../database/user.js");
class Token {
  constructor(obj) {
    console.log(obj)
    for (let key in obj) {
      //循环遍历传入对象
      this[key] = obj[key];
    }
  }

  static  getByName(name,cb){
    Token.getId(name,(err,id)=>{  //根据用户查询用户Id
      console.log(id)
      if(err) return cb(err);
      cb(id)
    })
  }
  static get(id,cb){
    db.hgetall(`${id}`,(err,user)=>{  // 获取普通对象哈希
      if(err) return cb(err);
      cb(null,new Token(user)) //将普通对象转换成新的User对象
   })
  }

  static getId(name,cb){
    db.get(`${name}`,cb);// 取得名称索引的id
  }

  

  //保存token关联用户
  save(cb) {
    
    //查询用户所有数据
    db.set(this.token, this.email, "EX", 10800, err => {  // set  token 索引用户信息
          
    });
    
  }
}

module.exports = Token;
