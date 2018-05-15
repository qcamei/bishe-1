const userApi = require('./api/user')
const attractionApi = require('./api/attraction')
const articleApi = require('./api/article')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const history = require('connect-history-api-fallback')
const app = express()
//
// const indexRoute = router.get('/', (req, res) => {
//   res.status(200).render('index', {
//     title: '首页'
//   })
// })
app.use(history({
  rewrites: [
    {from: /^\/map$/, to: '/'}
  ]
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// 后端api路由

app.use('/api/user', userApi)
app.use('/api/attraction', attractionApi)
app.use('/api/article', articleApi)
// 监听端口
app.listen(3000, () => {
  console.log('success listen at port:3000......')
})
