const { rectRectCollide } = require('../../shared/collide')
const { tileCollide } = require('./tileData')
const constrain = (a, b, c) => a < b ? b : a > c ? c : a
const sign = (n) => n < 0 ? -1 : n > 0 ? 1 : 0

const { MAP_W, MAP_H, PLAYER_SIZE } = require('../../shared/constants')

class Player {
  constructor(id, username, x, y) {
    this.id = id
    this.username = username
    this.x = x
    this.y = y
    this.w = this.h = PLAYER_SIZE
    this.xVel = 0
    this.yVel = 0
    this.accel = 10
    this.angle = 0
    this.speed = 200
    this.slowdown = 0.9
    this.health = 100
    this.moveState = {}
  }
  handleInput(input) {
    this.moveState = input
  }
  update(dt, blocks) {
    if(this.moveState.up) this.yVel = Math.max(this.yVel - this.accel, -this.speed)
    else if(this.moveState.down) this.yVel = Math.min(this.yVel + this.accel, this.speed)
    else this.yVel *= this.slowdown
    
    if(this.moveState.left) this.xVel = Math.max(this.xVel - this.accel, -this.speed)
    else if(this.moveState.right) this.xVel = Math.min(this.xVel + this.accel, this.speed)
    else this.xVel *= this.slowdown

    this.angle = this.moveState.angle

    const oldPos = { x: this.x, y: this.y }

    this.x += this.xVel * dt
    this.y += this.yVel * dt

    if(tileCollide(this.x, this.y, this.w, this.h)) {
      console.log('co')
      if(!tileCollide(oldPos.x, oldPos.y, this.w, this.h)) {
        console.log('bi')
        const blockedY = tileCollide(oldPos.x, this.y, this.w, this.h)
        const blockedX = tileCollide(this.x, oldPos.y, this.w, this.h)
        if(blockedX) {
          this.x = oldPos.x
          this.xVel = 0
        }
        if(blockedY) {
          this.y = oldPos.y
          this.yVel = 0
        }
      } 
    }

    // for(const b of blocks) {
      // if(!rectRectCollide(this.x, this.y, PLAYER_SIZE, PLAYER_SIZE, b.x, b.y, b.w, b.h)) continue;
      // const blockedX = Math.abs(oldPos.y - b.y) * 2 < PLAYER_SIZE + b.h
    //   const blockedY = Math.abs(oldPos.x - b.x) * 2 < PLAYER_SIZE + b.w
    //   if(blockedX) {
    //     this.x = b.x + sign(oldPos.x - b.x) * ((PLAYER_SIZE + b.w) / 2 + 0.1)
    //     this.xVel = 0
    //   }
    //   if(blockedY) {
    //     this.y = b.y + sign(oldPos.y - b.y) * ((PLAYER_SIZE + b.h) / 2 + 0.1)
    //     this.yVel = 0
    //   }
    // }

    this.x = constrain(this.x, 0, MAP_W)
    this.y = constrain(this.y, 0, MAP_H)
  }
  getData() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      angle: this.angle,
      health: this.health,
      username: this.username
    }
  }
}

module.exports = { Player }