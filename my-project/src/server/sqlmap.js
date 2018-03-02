var sqlMap = {
  user: {
    add: 'insert into user_login( username, password) values ( ?, ?)',
    select_name: 'SELECT username,password from user_login where username = ?',    // 查询 username
    have_name: 'SELECT username from user_login where username = ?'      // 查询 password
  },
  attraction: {
    select_city: 'SELECT attraction from attraction where city = ?'
  }
}

module.exports = sqlMap
