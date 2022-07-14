const { Block } = require('./block')
const { Bullet, bulletHandler } = require('./bullet')
const { Player, playerHandler } = require('./player')
const { dist } = require('../../shared/math')
const { pointCenterRectCollide } = require('../../shared/collide')
const { MAP_SIZE, MAP_W, MAP_H } = require('../../shared/constants')
const { getTiles } = require('./tileData')
const { update } = require('./update')
const { teamHandler } = require('./team')

const GameHandler = function() {
  this.blocks = []
  this.lastUpdate = Date.now()
  this.sendUpdate = true
  setInterval(() => this.update(), 1000 / 60)
}

GameHandler.prototype.addBlock = function(x, y) {
  this.blocks.push(new Block(x, y))
}

GameHandler.prototype.addPlayer = function(socket, username) {
  const x = MAP_W / 2 + Math.random() * 400 - 200
  const y = MAP_H / 2 + Math.random() * 400 - 200
  playerHandler.add(socket, username, x, y) 
  this.sendInitialState(socket)
}

GameHandler.prototype.removePlayer = function(id) {
  playerHandler.remove(id)
}

GameHandler.prototype.handleInput = function(id, input) {
  playerHandler.sendInput(id, input)
}

GameHandler.prototype.handleUpgrade = function(id, data) {
  playerHandler.handleUpgrade(id, data)
}

GameHandler.prototype.sendInitialState = function(socket) {
  socket.emit('initialState', { 
    tiles: getTiles()
  })
}

GameHandler.prototype.createTeam = function(socket, name) {
  const player = playerHandler.players[socket.id]
  if(!player) {
    return socket.emit('create-team-failure', '')
  }
  teamHandler.createTeam(name, player)
}

GameHandler.prototype.update = function() {
  const now = Date.now()
  const dt = (now - this.lastUpdate) / 1000
  this.lastUpdate = now

  update(dt)

  // only sends an update every other frame
  if(this.sendUpdate) {
    for(const key in playerHandler.players) {
      const player = playerHandler.players[key]
      playerHandler.sockets[key].emit('gameupdate', this.buildUpdate(player))
    }
  }
  this.sendUpdate = !this.sendUpdate
}

GameHandler.prototype.buildUpdate = function(player) {
  const others = Object.values(playerHandler.players).filter(p => p !== player).map(p => p.getData())
  const bullets = bulletHandler.bullets.map(bullet => bullet.getData())

  return {
    timestamp: Date.now(),
    me: player.getData(),
    others,
    bullets,
    teams: Object.values(teamHandler.teams).map(t => t.getData())
  }
}


module.exports = GameHandler