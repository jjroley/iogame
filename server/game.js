const { Bullet } = require('./bullet')
const { Player } = require('./player')

const dist = (x1, y1, x2, y2) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

class Game {
  constructor() {
    this.players = {}
    this.sockets = {}
    this.bullets = []
    this.lastUpdate = Date.now()
    this.sendUpdate = true
    setInterval(this.update.bind(this), 1000 / 60)
  }
  addPlayer(socket, username) {
    this.players[socket.id] = new Player(socket.id, username, 0, 0) 
    this.sockets[socket.id] = socket
  }
  removePlayer(id) {
    delete this.players[id]
    delete this.sockets[id]
  }
  handleInput(id, input) {
    const player = this.players[id]
    if(!player) return
    player.handleInput(input)
  }
  shoot(id) {
    const player = this.players[id]
    if(!player) return
    this.bullets.push(new Bullet(id, player.x, player.y, player.angle))
  }
  update() {
    const now = Date.now()
    const dt = (now - this.lastUpdate) / 1000
    this.lastUpdate = now

    for(var i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i]
      if(bullet.dead) {
        this.bullets.splice(i, 1)
        continue;
      }
      Object.values(this.players).forEach(player => {
        if(bullet.playerId === player.id) return
        if(dist(bullet.x, bullet.y, player.x, player.y) < 30) {
          player.xVel += bullet.xVel * bullet.speed
          player.yVel += bullet.yVel * bullet.speed
          player.health -= 5
          bullet.dead = true
        }
      })
      this.bullets[i].update(dt)
    }

    Object.values(this.players).forEach(player => {
      player.update(dt)
    })

    if(this.sendUpdate) {
      for(const key in this.players) {
        const player = this.players[key]
        this.sockets[key].emit('gameupdate', this.buildUpdate(player))
      }
    }
    this.sendUpdate = !this.sendUpdate
  }
  buildUpdate(player) {
    const others = Object.values(this.players).filter(p => p !== player).map(p => p.getData())
    const bullets = this.bullets.map(bullet => bullet.getData())

    return {
      timestamp: Date.now(),
      me: player.getData(),
      others,
      bullets,
    }
  }
}

module.exports = { Game }