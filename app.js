var express = require('express')
var app = express()
var path = require('path')
var server = require('http').createServer(app)
server.listen(8888, () => {
  console.log('开启')
})
app.use(express.static('./dist'))
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '/index.html'))
})
