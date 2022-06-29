


class Vector {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
  add(vec) {
    this.x += vec.x
    this.y += vec.y
    return this
  }
  sub(vec) {
    this.x -= vec.x
    this.y -= vec.y
    return this
  }
  mult(num) {
    this.x *= num
    this.y *= num
    return this
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
  lengthSquared() {
    return this.x * this.x + this.y * this.y
  }
  heading() {
    return Math.atan2(this.y, this.x)
  }
}

Vector.random2d = function() {
  const angle = Math.random() * Math.PI * 2
  return new Vector(Math.cos(angle), Math.sin(angle))
}

export default Vector