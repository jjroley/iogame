const { rectRectCollide } = require('../../shared/collide')
const { tileCollide, dealTileDamage } = require('./tileData')
const constrain = (a, b, c) => a < b ? b : a > c ? c : a
const sign = (n) => n < 0 ? -1 : n > 0 ? 1 : 0
const { MAP_W, MAP_H, PLAYER_SIZE, PLAYER_STATS, WEAPON_STATS, BLOCK_SIZE } = require('../../shared/constants')
const { bulletHandler } = require('./bullet')
const { dist } = require('../../shared/math')

class Player {
  constructor(id, username, x, y) {
    this.id = id
    this.username = username
    this.x = x
    this.y = y
    this.w = this.h = PLAYER_SIZE
    this.xVel = 0
    this.yVel = 0
    this.accel = 10
    this.angle = 0
    this.speed = 200
    this.slowdown = 0.9
    this.moveState = {}
    this.teamId = null
    this.rank = 0
    this.coins = 1000000
    this.attackCooldown = 0
    this.purchasedCharacters = []
    this.purchaseCharacter(0)
    this.changeCharacter(0)
    this.health = this.maxHealth
  }
  changeCharacter(character) {
    if(character >= PLAYER_STATS.length) return
    if(!this.purchasedCharacters.includes(character)) return
    const stats = PLAYER_STATS[character]
    this.weapon = WEAPON_STATS[stats.weapon]
    this.weaponName = stats.weapon
    this.health && (this.health *= this.maxHealth / stats.health)
    this.maxHealth = stats.health
    if(stats.size) {
      this.w = this.h = stats.size
    }else {
      this.w = this.h = PLAYER_SIZE
    }
    this.speed = stats.speed
    this.rank = character
    // console.log("Changed to " + character, this.speed, this.w, stats.name)
  }
  purchaseCharacter(character) {
    if(character >= PLAYER_STATS.length) return
    if(this.purchasedCharacters.includes(character)) return
    if(this.coins < PLAYER_STATS[character].cost) return
    this.purchasedCharacters.push(character)
    this.coins -= PLAYER_STATS[character].cost
  }
  handleAttack() {
    if(this.attackCooldown < this.weapon.cooldown) return

    if(this.weaponName === 'sword' || this.weaponName === 'fists' || this.weaponName === 'giantFists') {
      // gets a point in front of the player
      const totalRange = this.w + this.weapon.range
      const ax = Math.cos(this.angle)
      const ay = Math.sin(this.angle)
      const attackPoint = {
        x: this.x + ax * totalRange,
        y: this.y + ay * totalRange
      }

      // striking other players
      Object.values(playerHandler.players).forEach(p => {
        // no hitting yourself
        if(p == this) return

        // check if strike point is inside other player
        if(dist(attackPoint.x, attackPoint.y, p.x, p.y) < p.w * 0.5 + 10) {
          p.xVel += 50 * ax * (this.weapon.damage * 100) / p.w
          p.yVel += 50 * ay * (this.weapon.damage * 100) / p.w
          p.health -= this.weapon.damage

          playerHandler.sendMessage('strike', { type: 'player', x: attackPoint.x, y: attackPoint.y })

          // check if player was killed by attack
          if(p.health <= 0) {
            playerHandler.onDeath({ enemy: this.username }, p.id)
          }
        }
      })    

      // striking blocks
      if(tileCollide(attackPoint.x, attackPoint.y, 3, 3)) {
        dealTileDamage(attackPoint.x, attackPoint.y, this.weapon.damage / 10)
        playerHandler.sendMessage('strike', { type: 'block', x: attackPoint.x, y: attackPoint.y })
      }
    }else if(this.weaponName === 'bow') {
      bulletHandler.add(this.id, this.username, this.x, this.y, this.angle)
    }
    
    this.attackCooldown = 0
  }
  handleInput(input) {
    if(input.type === 'attack') {
      this.handleAttack()
    }else if(input.type === 'move') {
      this.moveState = input.keys
    }else if(input.type === 'angle') {
      this.angle = input.angle
    }
  }
  update(dt) {

    // increment cooldown
    this.attackCooldown = Math.min(this.attackCooldown + dt, this.weapon.cooldown)

    // moving vertically
    if(this.moveState.up) this.yVel = Math.max(this.yVel - this.accel, -this.speed)
    else if(this.moveState.down) this.yVel = Math.min(this.yVel + this.accel, this.speed)
    else this.yVel *= this.slowdown
    
    // moving horizontally
    if(this.moveState.left) this.xVel = Math.max(this.xVel - this.accel, -this.speed)
    else if(this.moveState.right) this.xVel = Math.min(this.xVel + this.accel, this.speed)
    else this.xVel *= this.slowdown

    // saves the old position before update
    const oldPos = { x: this.x, y: this.y }

    // updates position
    this.x += this.xVel * dt
    this.y += this.yVel * dt

    // checks for collision with tile
    const tiles = tileCollide(this.x, this.y, this.w, this.h)
    if(tiles) {
      const r = (this.w + BLOCK_SIZE) / 2
      for(const tile of tiles) {
        const blockedX = Math.abs(tile.y - oldPos.y) < r
        const blockedY = Math.abs(tile.x - oldPos.x) < r
        if(blockedX) {
          this.x = tile.x + sign(this.x - tile.x) * r
          // this.x = oldPos.x
          this.xVel = 0
        }
        if(blockedY) {
          // this.y = oldPos.y
          this.y = tile.y + sign(this.y - tile.y) * r
          this.yVel = 0
        }
      }
    }

    // keeps player from going off edge of map
    this.x = constrain(this.x, this.w * 0.5, MAP_W - this.w * 0.5)
    this.y = constrain(this.y, this.w * 0.5, MAP_H - this.w * 0.5)
  }
  getData() {
    // returns data to be sent to client
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      size: this.w,
      angle: this.angle,
      health: this.health,
      username: this.username,
      teamId: this.teamId,
      rank: this.rank,
      cooldown: 1 - this.attackCooldown / this.weapon.cooldown
    }
  }
}

const playerHandler = {
  players: {},
  sockets: {},
  add(socket, username, x, y) {
    this.sockets[socket.id] = socket
    this.players[socket.id] = new Player(socket.id, username, x, y)
  },
  remove(id) {
    delete this.players[id]
    delete this.sockets[id]
  },
  sendInput(id, input) {
    const player = this.players[id]
    if(!player) return
    player.handleInput(input)
  },
  sendMessage(type, data) {
    Object.values(this.sockets).forEach(socket => {
      socket.emit(type, data)
    })
  },
  handleUpgrade(id, data) {
    const player = this.players[id]
    if(!player) return
    if(data.type === 'character') {
      player.purchaseCharacter(data.character)
      player.changeCharacter(data.character)
      player.health = player.maxHealth
    }
  }, 
  onDeath(data, id) {
    this.sockets[id].emit('death', data)
    this.remove(id)
  },
  update(dt) {
    
  }
}

module.exports = { Player, playerHandler }