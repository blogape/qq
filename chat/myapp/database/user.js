var user={
    insert:'INSERT INTO  user (email,password,headimg) VALUES (?,?,?)',
    getUserByEmail:'select * from user where email =?',
    query:'select * from user where id =?',
    queryPwd:'select * from user where pasword=?',
    queryUser:'select email,headimg,status from user' //查询用户信息
 }
 module.exports=user;