


class Canvas {
  constructor(id) {
    this.canvas = document.querySelector(id || "#canvas")
    this.ctx = this.canvas.getContext('2d')
    this.mouseX = 0
    this.mouseY = 0
    this.width = window.innerWidth
    this.height = wineow.innerHeight
    this.minWidth = 800
    window.addEventListener('resize', () => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.scaleRatio = Math.max(1, this.minWidth / window.innerWidth)
    })
    window.addEventListener('mousemove', e => {
      this.mouseX = e.clientX * this.scaleRatio
      this.mouseY = e.clientY * this.scaleRatio
    })
  }
  wrap(cb) {
    this.ctx.save()
    cb(this.canvas, this.ctx)
    this.ctx.restore()
  }
  
}

const canvas = new Canvas()

export default canvas

// helper functions

export function cache(w, h, cb, type) {
  const can = document.createElement('canvas')
  can.width = w
  can.height = h
  const ctx = can.getContext('2d')
  cb(can, ctx, w, h)
  if(type === 'pattern') {
    const pattern = ctx.createPattern(can, 'repeat')
    pattern.width = w
    pattern.height = h
    return pattern
  }
  return can
}