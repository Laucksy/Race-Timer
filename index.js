var path = require('path')
var fs = require('fs')
var app = require('express')()
var bodyParser = require('body-parser')
// var http = require('http').Server(app)
var port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))

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
  console.log('received checkpoint with id ' + parseInt(req.params.id))
  fs.appendFile(path.join(__dirname, '/checkpoints.csv'), req.params.id + ',' + (new Date()).toISOString() + '\n', (err) => { if (err) console.log(err) })
  fs.appendFile(path.join(__dirname, '/checkpoints_backup.csv'), req.params.id + ',' + (new Date()).toISOString() + '\n', (err) => { if (err) console.log(err) })
  res.send('received checkpoint with id ' + req.params.id)
})

app.get('/api/freeCheckpoints', (req, res) => {
  fs.readFile(path.join(__dirname, '/runners.csv'), 'utf-8', function (err, runners) {
    if (err) res.send(err.message)
    else {
      fs.readFile(path.join(__dirname, '/checkpoints.csv'), 'utf-8', function (e, checkpoints) {
        runners = runners.split('\n')
        checkpoints = checkpoints.split('\n')
        checkpoints = checkpoints.map(function (c) { return c.split(',')[0] })
        if (e) res.send(e.message)
        else {
          runners.forEach(r => {
            let pieces = r.split(',')
            if (checkpoints.indexOf(pieces[pieces.length - 1]) >= 0) {
              checkpoints.splice(checkpoints.indexOf(pieces[pieces.length - 1]), 1)
            } else {
              console.log('Runner ' + r + ' has checkpoint not associated with known key.')
            }
          })
          res.send(checkpoints)
        }
      })
    }
  })
})

app.post('/api/registerRunner/', (req, res) => {
  let data = req.body
  console.log('received registration with info ' + data.name + ', ' + data.type + ', ' + data.heat + ', ' + data.id)
  fs.appendFile(path.join(__dirname, '/runners.csv'), data.name + ',' + data.type + ',' + data.heat + ',' + data.id + '\n', (err) => { if (err) console.log(err) })
  fs.appendFile(path.join(__dirname, '/runners_backup.csv'), data.name + ',' + data.type + ',' + data.heat + ',' + data.id + '\n', (err) => { if (err) console.log(err) })
})

app.get('/api/registerTime/', (req, res) => {
  let date = new Date()
  console.log('received time ' + date.toISOString())
  fs.appendFile(path.join(__dirname, '/times.csv'), date.toISOString() + '\n', (err) => { if (err) console.log(err) })
  fs.appendFile(path.join(__dirname, '/times_backup.csv'), date.toISOString() + '\n', (err) => { if (err) console.log(err) })
  res.send('received time ' + date.toISOString())
})

app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  res.localsmessage = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.send('Error')
})

app.listen(port, '0.0.0.0', () => {
  console.log('listening on *:' + port)
})
