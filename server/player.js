
class Player {
  constructor(id, username, x, y) {
    this.id = id
    this.username = username
    this.x = x
    this.y = y
    this.angle = 0
    this.speed = 200
    this.moveState = {}
  }
  handleInput(input) {
    this.moveState = input
  }
  update(dt) {
    let xVel = 0, yVel = 0
    if(this.moveState.up) yVel -= 1
    if(this.moveState.down) yVel += 1
    if(this.moveState.left) xVel -= 1
    if(this.moveState.right) xVel += 1
    this.angle = this.moveState.angle
    this.x += xVel * dt * this.speed
    this.y += yVel * dt * this.speed
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