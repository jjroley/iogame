const { Block } = require('../block')
const { Bullet } = require('../bullet')
const { Player } = require('../player')

const GameHandler = function() {
  this.players = {}
  this.sockets = {}
  this.bullets = []
  this.blocks = []
  this.lastUpdate = Date.now()
  this.sendUpdate = true
  setInterval(this.update.bind(this), 1000 / 60)
}

GameHandler.prototype.addBlock = function(x, y) {
  this.blocks.push(new Block(x * 90 - 45, y * 90 - 45, 90, 90))
}

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

GameHandler.prototype.update = function() {
  const now = Date.now()
  const dt = (now - this.lastUpdate) / 1000
  this.lastUpdate = now

  for(var i = this.bullets.length - 1; i >= 0; i--) {
    const bullet = this.bullets[i]
    Object.values(this.players).forEach(player => {
      if(bullet.playerId === player.id) return
      if(dist(bullet.x, bullet.y, player.x, player.y) < 30) {
        player.xVel += bullet.xVel * bullet.speed
        player.yVel += bullet.yVel * bullet.speed
        player.health -= 20
        bullet.dead = true
        if(player.health <= 0) {
          this.sockets[player.id].emit("death", {
            shotBy: this.players[bullet.playerId].username
          })
          this.removePlayer(player.id)
        }
      }
    })
    bullet.handleCollide(this.blocks)
    if(bullet.x < -1000 || bullet.x > 1000 || bullet.y < -1000 || bullet.y > 1000) bullet.dead = true
    if(bullet.dead) {
      this.bullets.splice(i, 1)
      continue;
    }
    this.bullets[i].update(dt)
  }

  Object.values(this.players).forEach(player => {
    player.update(dt, this.blocks)
  })

  if(this.sendUpdate) {
    for(const key in this.players) {
      const player = this.players[key]
      this.sockets[key].emit('gameupdate', this.buildUpdate(player))
    }
  }
  this.sendUpdate = !this.sendUpdate
}

GameHandler.prototype.buildUpdate = function(player) {
  const others = Object.values(this.players).filter(p => p !== player).map(p => p.getData())
  const bullets = this.bullets.map(bullet => bullet.getData())

  return {
    timestamp: Date.now(),
    me: player.getData(),
    others,
    bullets,
  }
}

module.exports = GameHandler