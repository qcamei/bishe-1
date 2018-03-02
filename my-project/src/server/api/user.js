var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../sqlmap')
var patternList = require('../pattern')
// 连接数据库
var conn = mysql.createConnection(models.mysql)

conn.connect(function (err) {
  if (err) {
    console.log(err, ' ')
  }
})
var jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: '操作失败'
    })
  } else {
    res.json(ret)
  }
}

// 增加用户接口
router.post('/addUser', (req, res) => {
  console.log('asd')
  var params = req.body
  console.log(params.username, params.password)
  var sql = $sql.user.have_name
  switch (params.type) {
    case 'name':
      var namePattern = patternList.judgeUser
      if (!namePattern.test(params.username)) {
        jsonWrite(res, {
          nameColor: true,
          nameUser: false,
          usernameTips: '格式错误,只包含字母数字下划线，不包含空格'
        })
      } else {
        // 用户名是否被占用
        conn.query(sql, params.username, function (err, result) {
          if (err) {
            console.log(err)
          }
          if (result[0] === undefined) {
            jsonWrite(res, {
              nameColor: false,
              usernameTips: '可以使用'
            })
          } else {
            jsonWrite(res, {
              nameColor: true,
              usernameTips: '该用户名已被注册'
            })
          }
        })
      }
      break
    case 'password' :
      var passwordPattern = patternList.judgePassword
      if (passwordPattern.test(params.password)) {
        jsonWrite(res, {
          passwordColor: false,
          passwordTips: '格式正确'
        })
      } else {
        jsonWrite(res, {
          passwordColor: true,
          passwordTips: '密码为数字字母与其他字符组成 不包含空格、纯数字或字母'
        })
      }
      break
    case 'all':
      if (params.passwordEqual) {
        console.log(params.username, params.password, params.passwordEqual)
        sql = $sql.user.add
        conn.query(sql, [params.username, params.password], function (err, result) {
          if (err) {
            console.log(err)
          }
          if (result) {
            console.log(result[0])
            jsonWrite(res, 'success')
          }
        })
      }
  }
})

// 查找用户接口
router.post('/login', (req, res) => {
  console.log('/login')
  var sqlusername = $sql.user.select_name
  var params = req.body
  console.log(req.body, req.query, req.params)
  conn.query(sqlusername, params.username, function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result[0] === undefined) {
      jsonWrite(res, -1)
      // 查询不出username，data返回-1
    } else {
      console.log(result[0].password)
      if (result[0].password === params.password) {
        jsonWrite(res, result[0].username)
      } else {
        // username正确后，password错误，data返回 0
        jsonWrite(res, 0)
      }
    }
  })
})
module.exports = router
