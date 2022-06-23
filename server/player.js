
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
    if(this.moveState.up) this.yVel -= this.accel
    else if(this.moveState.down) this.yVel += this.accel
    else this.yVel *= this.slowdown
    
    if(this.moveState.left) this.xVel -= this.accel
    else if(this.moveState.right) this.xVel += this.accel
    else this.xVel *= this.slowdown

    this.xVel = Math.min(this.speed, Math.max(this.xVel, -this.speed))
    this.yVel = Math.min(this.speed, Math.max(this.yVel, -this.speed))

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