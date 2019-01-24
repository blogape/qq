var record={
    insert:'INSERT INTO  record (id,record) VALUES (1,?)',
    query:'select * from record where id= 1 ',
    update: 'UPDATE record set record = ?  where id=1 '
}

module.exports=record;