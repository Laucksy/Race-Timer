var path = require('path')
var fs = require('fs')
var app = require('express')()
// var http = require('http').Server(app)
var port = process.env.PORT || 3000

app.listen(port, '0.0.0.0', () => {
  console.log('listening on *:' + port)
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '/register.html'))
})

app.get('/timing', (req, res) => {
  res.sendFile(path.join(__dirname, '/timing.html'))
})

app.get('/api/addCheckpoint/:id', (req, res) => {
  console.log('received checkpoint with id ' + req.params.id)
  fs.appendFile(path.join(__dirname, '/checkpoints.csv'), req.params.id + '\n', (err) => { if (err) console.log(err) })
  fs.appendFile(path.join(__dirname, '/checkpoints_backup.csv'), req.params.id + '\n', (err) => { if (err) console.log(err) })
  res.send('received checkpoint with id ' + req.params.id)
})

app.get('/api/registerRunner/:name/:type/:id', (req, res) => {
  console.log('received registration with info ' + req.params.name + ', ' + req.params.type + ', ' + req.params.id)
  fs.appendFile(path.join(__dirname, '/runners.csv'), req.params.name + ',' + req.params.type + ',' + req.params.id + '\n', (err) => { if (err) console.log(err) })
})

app.get('/api/registerTime/', (req, res) => {
  let date = new Date()
  console.log('received time ' + date.toISOString())
  fs.appendFile(path.join(__dirname, '/times.csv'), date.toISOString() + '\n', (err) => { if (err) console.log(err) })
  fs.appendFile(path.join(__dirname, '/times_backup.csv'), date.toISOString() + '\n', (err) => { if (err) console.log(err) })
  res.send('received time ' + date.toISOString())
})
