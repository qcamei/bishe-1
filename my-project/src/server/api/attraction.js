var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../sqlmap')

// 连接数据库
var conn = mysql.createConnection(models.mysql)
console.log(models.mysql)
conn.connect(function (err) {
  if (err) {
    console.log(err)
  }
})
var jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: '查询无此结果'
    })
  } else {
    res.json(ret)
  }
}

router.get('/selectCity', (req, res) => {
  var sqlcity = $sql.attraction.select_city
  var params = req.query
  conn.query(sqlcity, params.city, function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result[0] === undefined) {
      res.send('-1')    // 查询失败
      console.log('查询失败')
    } else {
      console.log('attraction search success')
      jsonWrite(res, result)
    }
  })
})
module.exports = router
