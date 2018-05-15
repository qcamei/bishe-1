var sqlMap = {
  user: {
    add: 'insert into user_login( username, password) values ( ?, ?)',
    select_name: 'SELECT username,password from user_login where username = ?',    // 查询 username
    have_name: 'SELECT username from user_login where username = ?',     // 查询 password
    password: 'SELECT password from user_login where username = ?',
    mpassword: 'UPDATE user_login set password = ? where username = ?',
    info: 'SELECT username,age,live,birth,gender from user_login ', // 所有
    oneinfo: 'SELECT username,age,live,birth,introduce,gender from user_login where username = ?',
    exactConcatInfo: 'SELECT username,age,live,birth,gender from user_login where ' +
    'concat(username,age,live,birth,gender) like ?', // 符合特定条件的
    modify: 'UPDATE user_login SET age = ?, live = ?,birth = ?,gender = ? WHERE username = ?',
    del: 'delete from user_login where username = ?'
  },
  manager: {
    select_key: 'SELECT id,password,`key` from manager where id = ?',
    judge_key: 'SELECT `key` from manager where `key` = ?'
  },
  attraction: {
    indexlist: 'select attraction,anum, introduce from attraction order by quantity desc limit 5',
    hot: 'SELECT attraction,quantity from attraction where city = ? order by quantity desc limit 5',
    addquantity: 'update attraction set quantity=quantity+1 where attraction = ?',
    incity: 'select country, province, city, anum,attraction,introduce,quantity from attraction' +
    ' where city = ? order by quantity desc',
    add: 'insert into attraction( country, province, city, attraction, introduce,quantity) values (?,?,?,?,?,0)',
    select_city: 'SELECT city,attraction,anum from attraction where concat(attraction,province,city) like ?',
    introduce: 'SELECT province,city,attraction,introduce,anum from attraction where attraction = ?',
    picture: 'select pic from attraction where num = ?',
    info: 'SELECT chau,country, province,anum,city,attraction,introduce from attraction',
    oneinfo: 'select country, province, city, anum,attraction,introduce from attraction where attraction = ?',
    exactinfo: 'SELECT country, province, city, anum, attraction,introduce from attraction ' +
    'where attraction like ?',
    exactConcatInfo: 'SELECT country, province,anum, city,attraction,introduce,anum ' +
    'from attraction where concat(attraction,province,city,chau) like ?',
    modify: 'UPDATE attraction SET attraction = ?, introduce = ? WHERE attraction = ?',
    del: 'delete from attraction where anum = ?'
  },
  city: {
    add: 'insert into attraction(chau, country, province, city, line, introduce,quantity) values (?,?,?,?,?,?,0)',
    addquantity: 'update city set quantity=quantity+1 where city = ?',
    hot: 'SELECT city,quantity from city order by quantity desc limit 7',
    city: 'SELECT city from city where city like ?',
    info: 'SELECT chau,country,province,city,line,introduce,quantity from city ',
    oneinfo: 'SELECT country,city,province, introduce,cnum,quantity, line from city where city = ?',
    exactinfo: 'SELECT country,province, city, introduce,cnum,quantity,line from city where city like ?',
    exactConcatInfo: 'SELECT chau,country,city, line,province, introduce,quantity from city ' +
    'where concat(chau, country, province,city, introduce,quantity) like ?'
  },
  guide: {
    addquantity: 'update guide set quantity=quantity+1 where gnum = ?',
    hotguide: 'select title, author,time,attraction,quantity,gnum from guide order by quantity desc limit 10',
    oneguide: 'select title, author,time,attraction,introduce,gnum,content,path from guide where gnum = ?',
    incity: 'SELECT title,author,time,attraction,introduce,gnum from guide where attraction = ?',
    indexlist: 'select title, gnum, introduce, path from guide order by time limit 5',
    gnum: 'select gnum from guide where title = ? and author = ?',
    add: 'insert into guide( title, author, time, content,attraction,introduce,path) values ( ?, ?, ?, ?, ?, ?, ?)',
    info: 'SELECT title, author,time,attraction,introduce from guide',
    userGuide: 'SELECT title, author,time,attraction,introduce,gnum from guide where author = ?',
    oneinfo: 'select title, author,time,attraction,introduce,gnum from guide where title = ?',
    exactinfo: 'select title, author,time,attraction,introduce,gnum from guide where title like ?',
    exactConcatInfo: 'SELECT title, author,time,attraction,gnum from guide where concat(title, author,time,attraction) like ?',
    title: 'select title, author ,gnum from guide where attraction = ?',
    content: 'select content,path from guide where gnum = ?',
    mfengmian: 'UPDATE guide SET path = ? where gnum = ?',
    modify: 'UPDATE guide SET title = ?, author = ? ,time = ?,content = ?,attraction = ? ,introduce = ?, path = ? WHERE gnum = ?',
    del: 'delete from guide where title=? and author=? and gnum = ?'
  },
  guidepinlun: {
    pinlunList: 'SELECT author,time,pinlun from guidepinlun where gnum=?',
    add: 'insert into guidepinlun( author, time, pinlun,gnum) values ( ?, ?, ?, ?)'
  },
  attpinlun: {
    pinlunList: 'SELECT author,time,pinlun from attpinlun where attraction = ?',
    add: 'insert into attpinlun( author, time, pinlun,attraction) values ( ?, ?, ?, ?)'
  }
}

module.exports = sqlMap
