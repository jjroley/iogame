const { createServer } = require('http')
const path = require('path')
const { Server: SocketServer } = require('socket.io')
const express = require('express')
const GameHandler = require('./server/game/gameHandler')
const { placeTileData, placedTiles } = require('./server/game/tileData')
const { MAP_H, MAP_SIZE } = require('./shared/constants')

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
  socket.on('upgrade', function(data) {
    console.log(data)
    game.handleUpgrade(socket.id, data)
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

placeTileData(0, 3, 1)
placeTileData(1, 3, 1)
placeTileData(2, 3, 1)
placeTileData(2, 4, 1)


placeTileData(9, 3, 1)
placeTileData(8, 3, 1)
placeTileData(7, 3, 1)
placeTileData(7, 4, 1)


placeTileData(0, 7, 1)
placeTileData(1, 7, 1)
placeTileData(2, 7, 1)
placeTileData(2, 6, 1)

placeTileData(9, 7, 1)
placeTileData(8, 7, 1)
placeTileData(7, 7, 1)
placeTileData(7, 6, 1)

placeTileData(4, 3, 1)
placeTileData(4, 4, 1)
placeTileData(4, 5, 1)
placeTileData(4, 6, 1)
placeTileData(4, 7, 1)

placeTileData(5, 3, 1)
placeTileData(5, 4, 1)
placeTileData(5, 5, 1)
placeTileData(5, 6, 1)
placeTileData(5, 7, 1)


placeTileData(3, 3, 1)
placeTileData(6, 7, 1)


for(var i = 0; i < 1000; i++) {
  placeTileData(~~(Math.random() * MAP_SIZE), ~~(Math.random() * MAP_SIZE), 1)
}