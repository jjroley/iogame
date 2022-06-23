const { Bullet } = require('./bullet')
const { Player } = require('./player')

class Game {
  constructor() {
    this.players = {}
    this.sockets = {}
    this.bullets = []
    this.lastUpdate = Date.now()
    this.sendUpdate = true
    setInterval(this.update.bind(this), 1000 / 60)
  }
  addPlayer(socket, username) {
    this.players[socket.id] = new Player(socket.id, username, 0, 0) 
    this.sockets[socket.id] = socket
  }
  removePlayer(id) {
    delete this.players[id]
    delete this.sockets[id]
  }
  handleInput(id, input) {
    const player = this.players[id]
    if(!player) return
    player.handleInput(input)
  }
  shoot(id) {
    const player = this.players[id]
    if(!player) return
    this.bullets.push(new Bullet(id, player.x, player.y, player.angle))
  }
  update() {
    const now = Date.now()
    const dt = (now - this.lastUpdate) / 1000
    this.lastUpdate = now

    Object.values(this.players).forEach(player => {
      player.update(dt)
    })

    this.bullets = this.bullets.filter(b => !b.dead)
    // for(var i = this.bullets.length - 1; i >= 0; i--) {
    //   if(this.bullets[i].dead) {
    //     this.bullets.splice(i, 1)
    //     continue;
    //   }
    // }

    if(this.sendUpdate) {
      for(const key in this.players) {
        const player = this.players[key]
        this.sockets[key].emit('gameupdate', this.buildUpdate(player))
      }
    }
    this.sendUpdate = !this.sendUpdate
  }
  buildUpdate(player) {
    const others = Object.values(this.players).filter(p => p !== player).map(p => p.getData())
      
    return {
      timestamp: Date.now(),
      me: player.getData(),
      others,
      bullets: this.bullets
    }
  }
}

module.exports = { Game }