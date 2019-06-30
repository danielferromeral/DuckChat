var express = require('express')
var app = express()
var path = require('path')

app.use(express.static(path.join(__dirname, '/src')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(3003, () => {
  console.log('Server is ON, the app is available at: http://localhost:3003')
})
