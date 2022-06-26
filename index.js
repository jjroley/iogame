const { createServer } = require('http')
const path = require('path')
const { Server: SocketServer } = require('socket.io')
const express = require('express')
const GameHandler = require('./server/game/gameHandler')
const app = express()
const server = createServer(app)

// app.use(express.static(path.join(__dirname, './client')))
// app.use(express.static(path.join(__dirname, './shared')))

app.use(express.static('dist'))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/views/index.html')
})

app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/client/views/login.html')
})

const io = new SocketServer(server)

io.on('connection', socket => {
  console.log("Client connected: " + socket.id)
  socket.on('join game', function(username) {
    console.log('Joining game', username)
    game.addPlayer(socket, username)
  })
  socket.on('input', function(input) {
    game.handleInput(socket.id, input)
  })
  socket.on('disconnect', () => {
    console.log("Client disconnected: " + socket.id)
    game.removePlayer(socket.id)
  })
  socket.on('shoot', () => {
    game.shoot(socket.id)
  })
})

server.listen(3000, () => console.log("Server up!"))

const game = new GameHandler()

game.addBlock(-5, -5)
game.addBlock(-4, -5)
game.addBlock(-3, -5)
game.addBlock(-2, -5)
game.addBlock(-1, -5)
game.addBlock(-0, -5)
game.addBlock(0, -6)
game.addBlock(0, -7)

