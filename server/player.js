
class Player {
  constructor(id, username, x, y) {
    this.id = id
    this.username = username
    this.x = x
    this.y = y
    this.xVel = 0
    this.yVel = 0
    this.accel = 10
    this.angle = 0
    this.speed = 200
    this.slowdown = 0.9
    this.moveState = {}
  }
  handleInput(input) {
    this.moveState = input
  }
  update(dt) {
    if(this.moveState.up) this.yVel = Math.max(this.yVel - this.accel, -this.speed)
    else if(this.moveState.down) this.yVel = Math.min(this.yVel + this.accel, this.speed)
    else this.yVel *= this.slowdown
    
    if(this.moveState.left) this.xVel = Math.max(this.xVel - this.accel, -this.speed)
    else if(this.moveState.right) this.xVel = Math.min(this.xVel + this.accel, this.speed)
    else this.xVel *= this.slowdown

    this.angle = this.moveState.angle
    this.x += this.xVel * dt
    this.y += this.yVel * dt
  }
  getData() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      angle: this.angle
    }
  }
}

module.exports = { Player }