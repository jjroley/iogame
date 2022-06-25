import io from 'socket.io-client'
import { interpolateObject, interpolateObjects } from './interpolate'

const socket = io()

const RENDER_DELAY = 100

class ServerUpdate {
  constructor() {
    this.gameUpdates = []
    this.gameStart = this.firstServerTimestamp = 0
  }
  process(update) {
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
  
    // If base is the most recent update we have, use its state.
    // Otherwise, interpolate between its state and the state of (base + 1).
    if (base < 0 || base === this.gameUpdates.length - 1) {
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
      socket.on('connect', resolve)
    })
  }
  reset() {
    this.gameUpdates = []
    this.gameStart = this.firstServerTimestamp = 0
  }
  send(msg, data) {
    socket.emit(msg, data)
  }
  on(msg, cb) {
    socket.on(msg, cb)
  }
  off(msg, cb) {
    socket.off(msg, cb)
  }
}

const server = new ServerUpdate()

export default server