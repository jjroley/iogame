const { rectRectCollide } = require('../../shared/collide')
const { tileCollide } = require('./tileData')
const constrain = (a, b, c) => a < b ? b : a > c ? c : a
const sign = (n) => n < 0 ? -1 : n > 0 ? 1 : 0

const { MAP_W, MAP_H, PLAYER_SIZE } = require('../../shared/constants')
const { bulletHandler } = require('./bullet')

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
    this.teamId = null
    this.rank = 0
    this.attackCooldown = 0
    this.attackRate = 1
  }
  handleInput(input) {
    if(input.type === 'attack') {
      if(this.attackCooldown < this.attackRate) return
      bulletHandler.add(this.id, this.x, this.y, this.angle)
      this.attackCooldown = 0
    }else if(input.type === 'move') {
      this.moveState = input.keys
    }else if(input.type === 'angle') {
      this.angle = input.angle
    }
  }
  update(dt, blocks) {

    this.attackCooldown = Math.min(this.attackCooldown + dt, this.attackRate)

    if(this.moveState.up) this.yVel = Math.max(this.yVel - this.accel, -this.speed)
    else if(this.moveState.down) this.yVel = Math.min(this.yVel + this.accel, this.speed)
    else this.yVel *= this.slowdown
    
    if(this.moveState.left) this.xVel = Math.max(this.xVel - this.accel, -this.speed)
    else if(this.moveState.right) this.xVel = Math.min(this.xVel + this.accel, this.speed)
    else this.xVel *= this.slowdown

    const oldPos = { x: this.x, y: this.y }

    this.x += this.xVel * dt
    this.y += this.yVel * dt

    if(tileCollide(this.x, this.y, this.w, this.h)) {
      if(!tileCollide(oldPos.x, oldPos.y, this.w, this.h)) {
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
      username: this.username,
      teamId: this.teamId,
      rank: this.rank
    }
  }
}

const playerHandler = {
  players: {},
  add(id, username, x, y) {
    this.players[id] = new Player(id, username, x, y)
  },
  remove(id) {
    delete this.players[id]
  },
  sendInput(id, input) {
    const player = this.players[id]
    if(!player) return
    player.handleInput(input)
  },
  update(dt) {
    let arr = Object.values(this.players)
    for(let i = arr.length - 1; i >= 0; i--) {
      const player = arr[i]
      player.update(dt)
    }
  }
}

module.exports = { Player, playerHandler }