const shortid = require('shortid')
const { pointCornerRectCollide } = require('../../shared/collide')
const { MAP_W, MAP_H } = require('../../shared/constants')
const { tileCollide, dealTileDamage } = require('./tileData')
// const { playerHandler } = require('./player')
const { dist } = require('../../shared/math')

class Bullet {
  constructor(playerId, playerUsername, x, y, angle) {
    this.id = shortid()
    this.playerId = playerId
    this.playerUsername = playerUsername
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
  add(playerId, username, x, y, angle) {
    this.bullets.push(new Bullet(playerId, username, x, y, angle))
  },
  update(dt) {}
    
}

module.exports = { Bullet, bulletHandler }