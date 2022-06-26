// import { ctx, width, height, scaleRatio, mouseX, mouseY, FONT } from './script'

import canvas, { cache } from './canvas'

const renderPlayer = player => {

  // display player
  canvas.wrap((_, ctx) => {
    ctx.translate(player.x, player.y)
    ctx.rotate(player.angle)
    ctx.fillStyle = 'rgb(255, 179, 0)'
    ctx.strokeStyle = 'rgb(200, 130, 0)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.ellipse(0, 0, 30, 30, 0, 0, Math.TWO_PI)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(30, 30, 10, 10, 0, 0, Math.TWO_PI)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(30, -30, 10, 10, 0, 0, Math.TWO_PI)
    ctx.fill()
    ctx.stroke()
  })

  // draw health bar
  canvas.wrap((_, ctx) => {
    ctx.fillStyle = 'transparent'
    ctx.strokeStyle = 'white'
    ctx.beginPath()
    ctx.rect(player.x - 50, player.y - 50, 100, 10)
    ctx.fill()
    ctx.stroke()
    let colorRed = 'rgb(200, 0, 0)'
    let colorGreen = 'rgb(0, 200, 0)'
    let colorYellow = 'rgb(200, 200, 0)'
    ctx.fillStyle = player.health > 50 ? colorGreen : player.health > 25 ?  colorYellow : colorRed                 
    ctx.beginPath()
    ctx.rect(player.x - 50, player.y - 50, player.health, 10)
    ctx.fill()
  })

  // display name
  canvas.wrap((_, ctx) => {
    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.font = `30px ${FONT}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(player.username, player.x, player.y - 70)
  })
}


export const cam = {
  x: 0, y: 0,
  mouseX: 0,
  mouseY: 0,
  follow(player) {
    this.x = player.x - width / 2
    this.y = player.y - height / 2
    this.mouseX = mouseX + this.x
    this.mouseY = mouseY + this.y
    ctx.translate(~~-this.x, ~~-this.y)
  }
}

export const renderData = (data) => {
  canvas.wrap((_, ctx) => {
    if(data.me) {
      cam.follow(data.me)
      ctx.save()
      ctx.fillStyle = grass
      ctx.fillRect(cam.x, cam.y, width, height)
      ctx.restore()
      renderPlayer(data.me)
    }
    if(data.others) {
      data.others.forEach(renderPlayer)
    }
    if(data.bullets) {
      // console.log(data.bullets)
      data.bullets.forEach(bullet => {
        ctx.fillStyle = 'gray'
        ctx.beginPath()
        ctx.ellipse(bullet.x, bullet.y, 5, 5, 0, 0, Math.PI * 2)
        ctx.fill()
      })
    }
    wrap(() => {
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 10
      ctx.strokeRect(-1000, -1000, 2000, 2000)
    })
    if(data.blocks) {
      ctx.fillStyle = 'gray'
      data.blocks.forEach(b => {
        ctx.fillRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h)
      })
    }
    ctx.restore()
  })
  
}



const grass = cache(360, 360, (can, ctx, w, h) => {
  for(var x = 0; x < 4; x += 1) {
    for(var y = 0; y < 4; y += 1) {
      const g = x % 2 === y % 2 ? 1 : x % 2 === 0 ? 2 : 0
      ctx.fillStyle = `rgb(0, ${200 - g * 20}, 0)`
      ctx.fillRect(x * 90, y * 90, 90, 90)
    }
  }
}, 'pattern')