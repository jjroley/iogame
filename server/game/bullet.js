const shortid = require('shortid')
const { pointCornerRectCollide } = require('../../shared/collide')
const { MAP_W, MAP_H } = require('../../shared/constants')
const { tileCollide } = require('./tileData')

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
  handleCollide() {
    if(!pointCornerRectCollide(this.x, this.y, 0, 0, MAP_W, MAP_H)) return this.dead = true
    if(tileCollide(this.x, this.y, 0, 0)) return this.dead = true
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