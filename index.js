var path = require('path')
var fs = require('fs')
var app = require('express')()
var http = require('http').Server(app)
var port = process.env.PORT || 3000

http.listen(port, () => {
  console.log('listening on *:' + port)
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/addCheckpoint/:id', (req, res) => {
  console.log('received checkpoint with id ' + req.params.id)
  fs.appendFile(path.join(__dirname, '/data.csv'), req.params.id + '\n', (err) => { if (err) console.log(err) })
  res.send('received checkpoint with id ' + req.params.id)
})
