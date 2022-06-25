const GameHandler = require('./index')
console.log(GameHandler.addBlock)

const { Bullet } = require('../bullet')
const { Player } = require('../player')

GameHandler.prototype.addPlayer = function(socket, username) {
  const x = ~~(Math.random() * 2000 - 1000)
  const y = ~~(Math.random() * 2000 - 1000)
  this.players[socket.id] = new Player(socket.id, username, x, y) 
  this.sockets[socket.id] = socket
  this.sendInitialState(socket)
}

GameHandler.prototype.removePlayer = function(id) {
  delete this.players[id]
  delete this.sockets[id]
}

GameHandler.prototype.handleInput = function(id, input) {
  const player = this.players[id]
  if(!player) return
  player.handleInput(input)
}


GameHandler.prototype.sendInitialState = function(socket) {
  socket.emit('initialState', { 
    blocks: this.blocks.map(b => b.getData()) 
  })
}

GameHandler.prototype.shoot = function(id) {
  const player = this.players[id]
  if(!player) return
  this.bullets.push(new Bullet(id, player.x, player.y, player.angle))
}

module.exports = GameHandler