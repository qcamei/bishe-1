var models = require('../db')
var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var app = express()
var Thenjs = require('thenjs')

const fs = require('fs')
var formidable = require('formidable')
var mysql = require('mysql')
var $sql = require('../sqlmap')
// // 连接数据库
var conn = mysql.createConnection(models.mysql)

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
router.get('/pinlun/getlist', (req, res) => {
  console.log('/pinlun/getlist' + req.query.id)
  var sql = $sql.guidepinlun.pinlunList
  conn.query(sql, req.query.id, function (err, result) {
    if (err) {
      console.log(err)
      jsonWrite(res, -2)
    }
    if (result[0] === undefined) {
      console.log('该攻略无评论')
      jsonWrite(res, -1)
    } else {
      console.log(result)
      jsonWrite(res, result)
    }
  })
})
router.post('/pinlun/add', (req, res) => {
  console.log('/pinlun/add' + req.body)
  var sql = $sql.guidepinlun.add
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
router.get('/att2/guidelist', (req, res) => {
  console.log('/att2/guidelist' + req.query.attraction)
  var sql = $sql.guide.incity
  conn.query(sql, req.query.attraction, function (err, result) {
    if (err) {
      console.log(err)
      jsonWrite(res, -2)
    }
    if (result[0] === undefined) {
      console.log('该景点无攻略')
      jsonWrite(res, -1)
    } else {
      console.log(result)
      jsonWrite(res, result)
    }
  })
})
// 用户删除攻略
router.delete('/userdelete', (req, res) => {
  console.log(req.query)
  conn.query($sql.guide.del, [req.query.title, req.query.author, req.query.gnum], function (err, result) {
    console.log('userdelete: ' + result[0])
    if (err) {
      console.log(err)
      jsonWrite(res, -1)
    } else {
      jsonWrite(res, 1)
    }
  })
})
// 用户所有的攻略
router.get('/userguide', (req, res) => {
  var sql = $sql.guide.userGuide
  console.log(req.query)
  conn.query(sql, req.query.username, function (err, result) {
    if (err) {
      console.log(err)
      jsonWrite(res, -2)
    }
    if (result[0] === undefined) {
      console.log('该用户无攻略')
      jsonWrite(res, -1)
    } else {
      console.log('userGuide: ' + result)
      jsonWrite(res, result)
    }
  })
})
router.get('/hotguide', (req, res) => {
  var sql = $sql.guide.hotguide
  conn.query(sql, function (err, result) {
    console.log('hotguide ' + result)
    if (err) {
      console.log(err)
      jsonWrite(res, -2)
    }
    if (result[0] === undefined) {
      jsonWrite(res, -1)
    } else {
      console.log('获取hotlist', result)
      jsonWrite(res, result)
    }
  })
})
router.get('/indexlist', (req, res) => {
  var sql = $sql.guide.indexlist
  conn.query(sql, function (err, result) {
    console.log('indexlist ' + result)
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
// 获取特定攻略所有信息
router.get('/oneguide', (req, res) => {
  var sql = $sql.guide.oneguide
  console.log(req.query)
  conn.query(sql, req.query.gnum, function (err, result) {
    console.log('oneguide ' + result)
    if (err) {
      console.log(err)
      jsonWrite(res, -2)
    }
    if (result[0] === undefined) {
      console.log('该用户无攻略')
      jsonWrite(res, -1)
    } else {
      jsonWrite(res, result)
    }
  })
  conn.query($sql.guide.addquantity, req.query.gnum, function (err, result) {
    if (err) {
      console.log('guide热度添加失败')
    }
  })
})
// 获取用户特定攻略内容
router.get('/userguide/content', (req, res) => {
  var sql = $sql.guide.content
  console.log(req.query)
  conn.query(sql, req.query.gnum, function (err, result) {
    console.log('userGuide/content: ' + result[0])
    if (err) {
      console.log(err)
      jsonWrite(res, -2)
    }
    if (result[0] === undefined) {
      console.log('该用户无攻略')
      jsonWrite(res, -1)
    } else {
      jsonWrite(res, JSON.stringify(result[0]))
    }
  })
})
router.post('/write', (req, res) => {
  var sql = $sql.guide.add
  var params = req.body
  console.log(params.mdata[1], params.mdata[6])
  Thenjs.parallel([function (callback) {
    conn.query(sql, params.mdata, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log('guide 添加成功')
      }
      callback(err, result)
    })
  }]).then(function (callback) {
    conn.query($sql.guide.gnum, [params.mdata[0], params.mdata[1]], function (err, result) {
      if (err) {
        console.log(err)
      } else {
        jsonWrite(res, {
          code: 1,
          gnum: result[0]
        })
      }
      callback(err, result)
    })
  })
})
router.post('/modify', (req, res) => {
  var sql = $sql.guide.modify
  var params = req.body
  console.log(params)
  conn.query(sql, params.mdata, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      console.log('guide 添加成功')
      jsonWrite(res, 1)
    }
  })
})

router.post('/fengmian', (req, res) => {
  var form = new formidable.IncomingForm()
  console.log(form)
  console.log(form.path)
  form.encoding = 'utf-8'
  form.uploadDir = '/my-project/static/guide'
  form.keepExtensions = true
  form.maxFieldsSize = 2 * 1024 * 1024
  form.parse(req, function (err, fields, files) {
    if (err) {
      jsonWrite(res, -2)
    } else {
      var path = '/static/guide/' + files.file.path.slice(files.file.path.lastIndexOf('\\') + 1)
      jsonWrite(res, {path: path})
    }
  })
})
router.post('/img', (req, res) => {
  var form = new formidable.IncomingForm()
  console.log(form)
  console.log(form.path)
  form.encoding = 'utf-8'
  form.uploadDir = '/my-project/static/img'
  form.keepExtensions = true
  form.maxFieldsSize = 2 * 1024 * 1024
  form.parse(req, function (err, fields, files) {
    if (err) {
      jsonWrite(res, -2)
    } else {
      console.log(files.file)
      var path = '/static/img/' + files.file.path.slice(files.file.path.lastIndexOf('\\') + 1)
      console.log('收到图片，路径：' + path)
      // fs.renameSync(files.upload.path, '/' + Date.now())// 重命名
      jsonWrite(res, {path: path})
      console.log('formidable fields:', fields)
    }
  })
})
module.exports = router
