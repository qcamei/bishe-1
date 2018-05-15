var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../sqlmap')
var Thenjs = require('thenjs')
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
// router.get('/hotcity', (req, res) => {
//
// })
router.get('/indexlist', (req, res) => {
  var sql = $sql.attraction.indexlist
  conn.query(sql, function (err, result) {
    console.log('aindexlist ' + result)
    if (err) {
      console.log(err)
      jsonWrite(res, -2)
    }
    if (result[0] === undefined) {
      jsonWrite(res, -1)
    } else {
      console.log('获取indexlist', result)
      jsonWrite(res, result)
    }
  })
})
router.get('/hotcity', (req, res) => {
  console.log('hotcity')
  var city = []
  Thenjs(function (callback) {
    conn.query($sql.city.hot, function (err, result) {
      callback(err, result)
      city = result
    })
  }).then(function (callback, result) {
    Thenjs.each(result, function (callback, value) {
      conn.query($sql.attraction.hot, value.city, function (err, result) {
        callback(err, result)
      })
    }).then(function (callback, result) {
      console.log(result, 'hotcity')
      var data = new Array([city.length])
      for (let i = 0; i < city.length; i++) {
        data[i] = {
          city: city[i].city,
          quantity: city[i].quantity,
          attraction: result[i]
        }
      }
      console.log(data)
      jsonWrite(res, {
        list: data
      })
    })
  })
})
router.get('/city1', (req, res) => {
  console.log('/city1')
  var params = req.query
  var r = new Array([3])
  Thenjs.parallel([
    function (callback) {
      conn.query($sql.city.oneinfo, params.city, function (err, result) {
        if (err) {
          console.log(err)
        }
        if (result[0] === undefined) {
          // 无精确城市
          console.log('无精确城市')
          r[0] = []
        } else {
          r[0] = result
          console.log('精确城市')
        }
        console.log('city1城市: ' + r[0])
        callback(err, result)
      })
    }, function (callback) {
      conn.query($sql.guide.incity, params.city, function (err, result) {
        if (err) {
          console.log(err)
        }
        if (result[0] === undefined) {
          r[1] = []
          console.log('无city1攻略')
        } else {
          r[1] = result
          console.log('city1攻略')
        }
        // console.log('city1攻略: ' + r[1])
        callback(err, result)
      })
    }, function (callback) {
      conn.query($sql.attraction.incity, params.city, function (err, result) {
        if (err) {
          console.log(err)
        }
        if (result[0] === undefined) {
          r[2] = []
          console.log('无city1景点')
        } else {
          // console.log('city1景点')
          r[2] = result
        }
        console.log('city1景点: ' + r[2])
        callback(err, result)
      })
    }]).then(function (callback, result) {
      console.log(r[0], r[1], r[2])
      jsonWrite(res, {
        info: r[0],
        attList: r[2],
        guideList: r[1]
      })
    })
  conn.query($sql.city.addquantity, params.city, function (err, result) {
    if (err) {
      console.log(err)
      console.log('城市热度添加失败')
    }
  })
})
router.get('/pinlun/getlist', (req, res) => {
  console.log('att2/pinlun/getlist' + req.query.id)
  var sql = $sql.attpinlun.pinlunList
  conn.query(sql, req.query.id, function (err, result) {
    if (err) {
      console.log(err)
      jsonWrite(res, -2)
    }
    if (result[0] === undefined) {
      console.log('该景点无评论')
      jsonWrite(res, -1)
    } else {
      console.log(result)
      jsonWrite(res, result)
    }
  })
})
router.post('/pinlun/add', (req, res) => {
  console.log('att/pinlun/add' + req.body)
  var sql = $sql.attpinlun.add
  var params = req.body
  console.log(params.mdata)
  // if (req.body === '' || req.body.id == null) {
  //   jsonWrite(res, -3)
  // }
  conn.query(sql, params.mdata, function (err, result) {
    if (err) {
      console.log(err)
      jsonWrite(res, -2)
    } else {
      console.log(result)
      jsonWrite(res, 1)
    }
  })
})
router.get('/selectCity', (req, res) => {
  console.log('/selectCity', req.query)
  if (req.query.city === '') {
    jsonWrite(res, [])
    return
  }
  var sqlcity = $sql.attraction.select_city
  var params = req.query
  conn.query(sqlcity, '%' + params.city + '%', function (err, result) {
    console.log(result)
    if (err) {
      console.log(err)
    }
    if (result[0] === undefined) {
      res.send('-1')    // 查询失败
      console.log('查询失败')
    } else {
      console.log(result)
      jsonWrite(res, result)
    }
  })
})
router.get('/att1list', (req, res) => {
  console.log('/attlist')
  // 先获取城市信息（精确 非精确）
  // var sql = $sql.city.oneinfo
  var params = req.query
  var cityList = {one: true, list: ''}
  var attList = {one: true, list: ''}
  var guideList = {one: true, list: ''}
  var list = new Array([3])
  console.log(params.city)
  var r = new Array([3])
  Thenjs.parallel([
    function (callback) {
      conn.query($sql.city.oneinfo, params.city, function (err, result) {
        if (err) {
          console.log(err)
        }
        if (result[0] === undefined) {
          // 无精确城市
          console.log('无精确城市')
          r[0] = []
        } else {
          console.log('精确城市')
          r[0] = result
        }
        console.log('00: ' + r)
        callback(err, result)
      })
    }, function (callback) {
      conn.query($sql.attraction.oneinfo, params.city, function (err, result) {
        if (err) {
          console.log(err)
        }
        if (result[0] === undefined) {
          console.log('无精确景点')
          r[1] = []
        } else {
          // attList.list = result
          console.log('精确景点', result)
          r[1] = result
        }
        console.log('01: ' + r)
        callback(err, result)
      })
    }, function (callback) {
      conn.query($sql.guide.oneinfo, params.city, function (err, result) {
        if (err) {
          console.log(err)
        }
        if (result[0] === undefined) {
          console.log('无精确攻略')
          r[2] = []
        } else {
          console.log('精确攻略', result)
          r[2] = result
        }
        console.log('02: ' + r)
        callback(err, result)
      })
    }]
  ).parallel([function (callback) {
    console.log('10: ' + r[0])
    if (r[0].length === 0) {
      // sql = $sql.city.exactinfo
      conn.query($sql.city.exactinfo, '%' + params.city + '%', function (err, result) {
        if (err) {
          console.log(err)
        }
        if (result[0] === undefined) {
          console.log('无模糊城市')
        } else {
          r[0] = result
          console.log('模糊城市', result)
        }
        callback(err, result)
      })
    } else {
      callback(null, r[0])
    }
  }, function (callback) {
    console.log('11: ' + r[1])
    if (r[1].length === 0) {
      conn.query($sql.attraction.exactinfo, '%' + params.city + '%', function (err, result) {
        if (err) {
          console.log(err)
        }
        if (result[0] === undefined) {
          console.log('无模糊景点')
        } else {
          r[1] = result
          console.log('模糊景点', result)
        }
        callback(err, result)
      })
    } else {
      callback(null, r[1])
    }
  }, function (callback) {
    console.log('11: ' + r[2])
    if (r[2].length === 0) {
      conn.query($sql.guide.exactinfo, '%' + params.city + '%', function (err, result) {
        if (err) {
          console.log(err)
        }
        if (result[0] === undefined) {
          console.log('无模糊攻略')
        } else {
          r[2] = result
          console.log('模糊攻略', result)
        }
        callback(err, result)
      })
    } else {
      callback(null, r[2])
    }
  }]).then(function (callback, result) {
    console.log(r[0], r[1], r[2])
    jsonWrite(res, {
      cityList: r[0],
      attList: r[1],
      guideList: r[2]
    })
  })
})
router.get('/introduce', (req, res) => {
  var sql = $sql.attraction.introduce
  var params = req.query
  console.log(params)
  conn.query(sql, params.attraction, function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result[0] === undefined) {
      res.send('-1')    // 查询失败
      console.log('查询失败')
    } else {
      jsonWrite(res, result)
      conn.query($sql.city.addquantity, params.city, function (err, result) {
        if (err) {
          console.log(err)
          console.log('城市热度添加失败')
        }
      })
    }
  })
  conn.query($sql.attraction.addquantity, params.attraction, function (err, result) {
    if (err) {
      console.log(err)
      console.log('景点热度添加失败')
    }
  })

})
module.exports = router
