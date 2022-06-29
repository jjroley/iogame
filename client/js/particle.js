import Vector from "./vector"

class Particle {
  constructor(x, y, c, speed) {
    this.x = x
    this.y = y
    this.c = c
    this.vel = Vector.random2d().mult(speed)
    this.life = 1
  }
  update(dt) {
    this.x += this.vel.x * dt
    this.y += this.vel.y * dt
    this.life -= dt
    if(this.life <= 0) this.dead = true
  }
  display(ctx) {
    ctx.fillStyle = `rgb(${this.c.join(',')})`
    // ctx.beginPath()
    // ctx.ellipse(this.x, this.y, 5, 5, 0, 0, Math.PI * 2)
    // ctx.fill()
    ctx.fillRect(this.x - 5, this.y - 5, 10, 10)
  }
}

const particles = []

export default Particle