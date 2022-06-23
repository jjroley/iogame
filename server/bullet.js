const shortid = require('shortid')

class Bullet {
  constructor(playerId, x, y, angle) {
    this.id = shortid()
    this.playerId = playerId
    this.x = x
    this.y = y
    this.xVel = Math.cos(angle)
    this.yVel = Math.sin(angle)
    this.speed = 600
    this.time = 10
    this.dead = false
  }
  update(dt) {
    this.x += this.xVel * dt * this.speed
    this.y += this.yVel * dt * this.speed
    this.time -= dt
    if(this.time <= 0) this.dead = true
  }
  getData() {
    return { id: this.id, x: this.x, y: this.y }
  }
}

module.exports = { Bullet }