import { canvas } from './canvas'


export const cam = {
  x: 0, y: 0,
  mouseX: 0,
  mouseY: 0,
  follow(player, ctx) {
    this.x = player.x - canvas.width / 2
    this.y = player.y - canvas.height / 2
    this.mouseX = canvas.mouseX + this.x
    this.mouseY = canvas.mouseY + this.y
    ctx.translate(~~-this.x, ~~-this.y)
  }
}