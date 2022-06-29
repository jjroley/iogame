import io from 'socket.io-client'
import { interpolateObject, interpolateObjects } from './interpolate'


const RENDER_DELAY = 100

class ServerUpdate {
  constructor() {
    this.socket = io()
    this.gameUpdates = []
    this.gameStart = this.firstServerTimestamp = 0
  }
  processUpdate(update) {
    if(!this.firstServerTimestamp) {
      this.gameStart = Date.now()
      this.firstServerTimestamp = update.timestamp
    }
    this.gameUpdates.push(update)
  
    const baseUpdate = this.getBaseUpdate()
    if(baseUpdate > 0) {
      this.gameUpdates.splice(0, baseUpdate)
    }
  }
  getBaseUpdate() {
    const serverTime = this.currentServerTime();
    for (let i = this.gameUpdates.length - 1; i >= 0; i--) {
      if (this.gameUpdates[i].timestamp <= serverTime) {
        return i;
      }
    }
    return -1
  }
  currentServerTime() {
    return this.firstServerTimestamp + (Date.now() - this.gameStart) - RENDER_DELAY;
  }
  getCurrentState() {
    if (!this.firstServerTimestamp) {
      return {};
    }
  
    const base = this.getBaseUpdate();
    const serverTime = this.currentServerTime();
  
    if (base < 0 || base === this.gameUpdates.length - 1) {
      console.log('usu')
      return this.gameUpdates[this.gameUpdates.length - 1];
    } else {
      const baseUpdate = this.gameUpdates[base];
      const next = this.gameUpdates[base + 1];
      const ratio = (serverTime - baseUpdate.timestamp) / (next.timestamp - baseUpdate.timestamp);
      return {
        me: interpolateObject(baseUpdate.me, next.me, ratio, 'x', 'y', 'angle'),
        others: interpolateObjects(baseUpdate.others, next.others, ratio, 'x', 'y', 'angle'),
        bullets: interpolateObjects(baseUpdate.bullets, next.bullets, ratio, 'x', 'y')
      };
    }
  }
  connect() {
    return new Promise(resolve => {
      this.socket.on('connect', resolve)
    })
  }
  reset() {
    this.gameUpdates = []
    this.gameStart = this.firstServerTimestamp = 0
  }
  send(msg, data) {
    this.socket.emit(msg, data)
  }
  on(msg, cb) {
    this.socket.on(msg, cb)
  }
  off(msg, cb) {
    this.socket.off(msg, cb)
  }
}

const server = new ServerUpdate()

export default server