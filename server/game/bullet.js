const shortid = require('shortid')
const { pointCenterRectCollide } = require('../../shared/collide')

class Bullet {
  constructor(playerId, x, y, angle) {
    this.id = shortid()
    this.playerId = playerId
    this.x = x
    this.y = y
    this.xVel = Math.cos(angle)
    this.yVel = Math.sin(angle)
    this.speed = 1000
    this.time = 10
    this.dead = false
  }
  handleCollide(blocks) {
    for(const b of blocks) {
      if(pointCenterRectCollide(this.x, this.y, b.x, b.y, b.w, b.h)) {
        this.dead = true
        break;
      }
    }
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