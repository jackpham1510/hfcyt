const express = require('express')
const app = express()

app.get('/', function (req, res){
  res.end('Welcome to How fast can you type!')
})

app.listen(3001)