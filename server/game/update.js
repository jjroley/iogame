
const { pointCornerRectCollide } = require('../../shared/collide')
const { MAP_W, MAP_H } = require('../../shared/constants')
const { dist } = require('../../shared/math')
const { bulletHandler } = require('./bullet')
const { playerHandler } = require('./player')
const { tileCollide, dealTileDamage } = require('./tileData')

const update = function(dt) {
  // update players
  let players = Object.values(playerHandler.players)
  for(let i = players.length - 1; i >= 0; i--) {
    const player = players[i]
    
    // remove player if dead
    if(player.health <= 0) {
      // killed by an unknown cause
      playerHandler.sockets[player.id].emit('death', { shotBy: "Unknown" })
      playerHandler.remove(player.id)
      continue;
    }

    // check collisions with bullets
    bulletHandler.bullets.forEach(bullet => {
      // don't get hit by teammates or dead bullets or yourself
      if(bullet.dead || bullet.playerId === player.id) return

      // bullet hits enemy player
      if(dist(player.x, player.y, bullet.x, bullet.y) < player.w / 2) {
        // knockback
        player.yVel = bullet.yVel * bullet.speed
        player.xVel = bullet.xVel * bullet.speed

        // damage player
        player.health -= bullet.damage

        // send a message to all clients that a strike has occured
        playerHandler.sendMessage('strike', { type: 'player', x: bullet.x, y: bullet.y })

        // kill bullet
        bullet.dead = true

        // send a message to player that got killed
        if(player.health <= 0) {
          playerHandler.onDeath({ enemy: bullet.playerUsername }, player.id)
        }
      }

    })

    // update
    player.update(dt)
  }

  // update bullets
  let bullets = bulletHandler.bullets
  for(let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i]

    // destroy if bullet goes outside map boundary
    if(!pointCornerRectCollide(bullet.x, bullet.y, 0, 0, MAP_W, MAP_H)) {
      bullet.dead = true
    }
    
    // check collisions with tiles
    if(tileCollide(bullet.x, bullet.y, 0, 0)) {
      dealTileDamage(bullet.x, bullet.y, bullet.damage / 10)
      // send a message to clients that a strike has occured
      playerHandler.sendMessage('strike', { type: 'block', x: bullet.x, y: bullet.y })
      // kill bullet
      bullet.dead = true
    }

    // remove if dead
    if(bullet.dead) {
      bullets.splice(i, 1)
      continue;
    }

    // update
    bullet.update(dt)
  }
}

module.exports = { update }