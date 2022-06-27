

CanvasRenderingContext2D.prototype.wrap = function(cb) {
  this.save()
  cb()
  this.restore()
}

class Canvas {
  constructor(id) {
    this.canvas = document.querySelector(id || "canvas")
    this.ctx = this.canvas.getContext('2d')
    this.mouseX = 0
    this.mouseY = 0
    this.minWidth = 800
    
    const _onResize = () => {
      this.scaleRatio = Math.max(1, this.minWidth / window.innerWidth)
      this.width = this.canvas.width = window.innerWidth * this.scaleRatio
      this.height = this.canvas.height = window.innerHeight * this.scaleRatio
    }
    _onResize()
    window.addEventListener('resize', _onResize)

    window.addEventListener('mousemove', e => {
      this.mouseX = e.clientX * this.scaleRatio
      this.mouseY = e.clientY * this.scaleRatio
    })
  }
  graphics(cb) {
    this.ctx.save()
    cb(this.ctx, this.canvas)
    this.ctx.restore()
  }
}



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


export const canvas = new Canvas('#canvas')
