const GameHandler = require('./index')


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