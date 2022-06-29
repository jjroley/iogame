const shortid = require('shortid')
const { pointCornerRectCollide } = require('../../shared/collide')
const { MAP_W, MAP_H } = require('../../shared/constants')
const { tileCollide, dealTileDamage } = require('./tileData')
// const { playerHandler } = require('./player')
const { dist } = require('../../shared/math')

class Bullet {
  constructor(playerId, x, y, angle) {
    this.id = shortid()
    this.playerId = playerId
    this.teamId = null
    this.x = x
    this.y = y
    this.xVel = Math.cos(angle)
    this.yVel = Math.sin(angle)
    this.speed = 1000
    this.time = 10
    this.dead = false
    this.damage = 20
  }
  handleCollide() {
    if(!pointCornerRectCollide(this.x, this.y, 0, 0, MAP_W, MAP_H)) return this.dead = true
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

const bulletHandler = {
  bullets: [],
  add(playerId, x, y, angle) {
    this.bullets.push(new Bullet(playerId, x, y, angle))
  },
  update(dt) {
    for(let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i]


      
      // handle collisions
      bullet.handleCollide()

      

      if(bullet.dead) {
        this.bullets.splice(i, 1)
        continue;
      }

      bullet.update(dt)
    }
  }
}

module.exports = { Bullet, bulletHandler }