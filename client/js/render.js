
import { canvas, cache } from './canvas'
import { cam } from './camera'
import { BLOCK_SIZE, MAP_SIZE } from '../../shared/constants'

const renderPlayer = player => {

  // display player
  canvas.graphics((ctx) => {

    ctx.save()
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
    ctx.restore()

    // health bar
    ctx.save()
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
    ctx.restore()
    
    ctx.save()
    ctx.fillStyle = 'white'
    ctx.font = `30px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(player.username, player.x, player.y - 70)
    ctx.restore()
  })
}

export const renderData = (data) => {
  canvas.graphics((ctx) => {
    ctx.fillStyle = grass
    ctx.fillRect(cam.x, cam.y, canvas.width, canvas.height)
    if(data.me) {
      cam.follow(data.me, ctx)
      renderPlayer(data.me)
    }
    if(data.others) {
      data.others.forEach(renderPlayer)
    }
    if(data.bullets) {
      data.bullets.forEach(bullet => {
        ctx.fillStyle = 'gray'
        ctx.beginPath()
        ctx.ellipse(bullet.x, bullet.y, 5, 5, 0, 0, Math.PI * 2)
        ctx.fill()
      })
    }
    if(data.blocks) {
      ctx.fillStyle = 'gray'
      data.blocks.forEach(b => {
        ctx.fillRect(b.x * BLOCK_SIZE, b.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
      })
    }
  })

  // map boundary
  canvas.graphics((ctx) => {
    ctx.save()
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 10
    ctx.strokeRect(-MAP_SIZE / 2, -MAP_SIZE / 2, MAP_SIZE, MAP_SIZE)
    ctx.restore()
  })
}



const grass = cache(BLOCK_SIZE * 4, BLOCK_SIZE * 4, (can, ctx) => {
  for(var x = 0; x < 4; x += 1) {
    for(var y = 0; y < 4; y += 1) {
      const g = x % 2 === y % 2 ? 1 : x % 2 === 0 ? 2 : 0
      ctx.fillStyle = `rgb(0, ${200 - g * 20}, 0)`
      ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
    }
  }
}, 'pattern')