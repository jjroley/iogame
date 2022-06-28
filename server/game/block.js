

class Block {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }
  getData() {
    return { x: this.x, y: this.y }
  }
}

module.exports = { Block }