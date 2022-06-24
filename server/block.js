

class Block {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }
  getData() {
    return { x: this.x, y: this.y, w: this.w, h: this.h }
  }
}


module.exports = { Block }