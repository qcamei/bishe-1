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
router.post('/checkUser', (req, res) => {
  var params = req.body
  var sql = $sql.user.have_name
  conn.query(sql, params.username, function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result[0] === undefined) {
      jsonWrite(res, {
        nameColor: true,
        usernameTips: '不存在该用户'
      })
    } else {
      jsonWrite(res, {
        nameColor: false,
        usernameTips: '合法用户'
      })
    }
  })
})
router.post('/password', (req, res) => {
  var params = req.body
  var sql = $sql.user.password
  conn.query(sql, params.username, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      console.log(result[0])
      if (result[0].password === params.oldpassword) {
        if (params.password === params.password2) {
          conn.query($sql.user.mpassword, [params.password, params.username],function (err, result) {
            if (err) {
              jsonWrite(res, 0)
            } else {
              jsonWrite(res, 1)
            }
          })
        } else {
          jsonWrite(res, -2)
        }
      } else {
        jsonWrite(res, -1)
      }
    }
  })
})
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
            res.json(1)
            // jsonWrite(res, 'success')
          }
        })
      }
  }
})
// 获得用户信息
router.get('/userInfo', (req, res) => {
  console.log('/userInfo', req.query)
  var query = req.query.username
  var sql = $sql.user.oneinfo
  conn.query(sql, query, function (err, result) {
    console.log(result)
    if (err) {
      jsonWrite(res, -1)
    }
    if (result[0] === undefined) {
      jsonWrite(res, -2)
      console.log('无用户信息')
    } else {
      jsonWrite(res, result)
    }
  })
})
router.patch('/updateInfo', (req, res) => {
  console.log(req.body)
  var sql = ''
  var mdata = req.body.mdata
  sql = $sql.user.modify
  conn.query(sql, mdata, function (err, result) {
    console.log('正在修改', result)
    if (err) {
      console.log(err)
      jsonWrite(res, -1)
    } else {
      jsonWrite(res, 1)
    }
  })
})
// 管理员登录
router.post('/manager/login', (req, res) => {
  console.log('/manager/login')
  var sqlmanager = $sql.manager.select_key
  var params = req.body
  console.log(req.body, req.query, req.params)
  conn.query(sqlmanager, params.managerId, function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result[0] === undefined) {
      jsonWrite(res, -1)
      // 查询不出username，data返回-1
    } else {
      console.log(result[0].password)
      if (result[0].password === params.password) {
        jsonWrite(res, result[0].key)
      } else {
        // username正确后，password错误，data返回 0
        jsonWrite(res, 0)
      }
    }
  })
})
// 管理员查找
router.get('/manager/search', (req, res) => {
  console.log('/manager/search', req.query)
  var sqlcity = ''
  var query = req.query.content
  conn.query($sql.manager.judge_key, req.query.key, function (err, result) {
    // 检查key值 确认登录
    console.log('检查key值 确认登录')
    if (err) {
      console.log(err)
    }
    if (result[0] === undefined) {
      jsonWrite(res, -2)   // 查询失败
      console.log('管理员未登录')
      return false
    }
  })
  // 输入要查找内容 空则显示所有
  if (query === '') {
    if (req.query.table === '用户信息') {
      sqlcity = $sql.user.info
    } else if (req.query.table === '攻略') {
      sqlcity = $sql.guide.info
    } else if (req.query.table === '景点') {
      sqlcity = $sql.attraction.info
    } else {
      sqlcity = $sql.city.info
    }
    conn.query(sqlcity, function (err, result) {
      console.log('/manager/search 查询中')
      if (req.query.table === '用户信息') {
        console.log(result)
      }
      if (err) {
        console.log(err)
      }
      if (result[0] === undefined) {
        res.send(-1)    // 查询失败
        console.log('查询失败')
      } else {
        jsonWrite(res, result)
      }
    })
  } else {
    if (req.query.table === '用户信息') {
      sqlcity = $sql.user.exactConcatInfo
    } else if (req.query.table === '攻略') {
      sqlcity = $sql.guide.exactConcatInfo
    } else if (req.query.table === '景点') {
      sqlcity = $sql.attraction.exactConcatInfo
    } else {
      sqlcity = $sql.city.exactConcatInfo
    }
    query = '%' + query + '%'
    conn.query(sqlcity, query, function (err, result) {
      console.log('查询中', result, query)
      if (err) {
        console.log(err)
      }
      if (result[0] === undefined) {
        res.send(-1)    // 查询失败
        console.log('查询失败')
      } else {
        console.log(result)
        jsonWrite(res, result)
      }
    })
  }
})
// 删除内容
router.delete('/manager/del', (req, res) => {
  console.log(req.query, req.params, req.body, req.query.key)
  conn.query($sql.manager.judge_key, req.query.key, function (err, result) {
    // 检查key值 确认登录
    console.log('检查key值')
    if (err) {
      console.log(err)
    }
    if (result[0] === undefined) {
      jsonWrite(res, -2)   // 查询失败
      console.log('管理员未登录')
      return false
    }
    console.log('key值正确')
  })
  var sqlcity = ''
  var mdata = req.query.mdata
  if (req.query.table === '用户信息') {
    sqlcity = $sql.user.del
  } else if (req.query.table === '攻略') {
    sqlcity = $sql.guide.del
  } else {
    sqlcity = $sql.attraction.del
  }
  console.log(sqlcity)
  conn.query(sqlcity, mdata, function (err, result) {
    console.log('正在删除')
    if (err) {
      console.log(err)
    } else {
      jsonWrite(res, 1)
    }
  })
})

router.patch('/manager/update', (req, res) => {
  console.log(req.body)
  conn.query($sql.manager.judge_key, req.body.key, function (err, result) {
    // 检查key值 确认登录
    console.log('检查key值 确认登录')
    if (err) {
      console.log(err)
    }
    if (result[0] === undefined) {
      jsonWrite(res, -2)    // 查询失败
      console.log('管理员未登录')
      return false
    }
  })
  var sql = ''
  var mdata = req.body.mdata
  var table = req.body.table
  if (table === '用户信息') {
    sql = $sql.user.modify
  } else if (table === '攻略') {
    sql = $sql.guide.modify
  } else {
    sql = $sql.attraction.modify
  }
  conn.query(sql, mdata, function (err, result) {
    console.log('正在修改', result)
    if (err) {
      console.log(err)
      jsonWrite(res, -1)
    } else {
      jsonWrite(res, 1)
    }
  })
})

router.post('/manager/add', (req, res) => {
  console.log(req.body, req.query, req.params)
  conn.query($sql.manager.judge_key, req.body.key, function (err, result) {
    // 检查key值 确认登录
    console.log('检查key值 确认登录')
    if (err) {
      console.log(err)
    }
    if (result[0] === undefined) {
      jsonWrite(res, -2)    // 查询失败
      console.log('管理员未登录')
      return false
    }
  })
  var sql = ''
  var mdata = req.body.mdata
  var table = req.body.table
  if (table === '景点') {
    sql = $sql.attraction.add
  } else if (table === '城市') {
    sql = $sql.city.add
  }
  // } else if (table === '攻略') {
  //   sql = $sql.guide.modify
  // } else {
  //   sql = $sql.attraction.modify
  // }
  conn.query(sql, mdata, function (err, result) {
    console.log('正在添加', result)
    if (err) {
      console.log(err)
      jsonWrite(res, -1)
    } else {
      jsonWrite(res, 1)
    }
  })
})
// 查找用户接口
router.post('/login', (req, res) => {
  console.log('/login')
  var sqlusername = $sql.user.select_name
  var params = req.body
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
