const { createServer } = require('http')
const { Server: SocketServer } = require('socket.io')
const express = require('express')
const { Game } = require('./server/game')

const app = express()
const server = createServer(app)

app.use(express.static('public'))

const io = new SocketServer(server)

io.on('connection', socket => {
  console.log("Client connected: " + socket.id)
  socket.on('join game', function(username) {
    console.log(this)
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

const game = new Game()



