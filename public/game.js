
const scene = {
  currentScene: null,
  scenes: {},
  sceneData: {},
  __sceneCallbacks: [],
  __cleanupCallbacks: [],
  to(newScene, data) {
    if(newScene in this.scenes) {
      if(this.__cleanupCallbacks.length) {
        this.__cleanupCallbacks.forEach(cleanup => cleanup())
      }
      this.__cleanupCallbacks = []
      this.__sceneCallbacks = []
      this.currentScene = newScene
      this.scenes[newScene](data)
    }
  },
  use(name, cb) {
    this.scenes[name] = cb
  },
  loop(cb) {
    this.__sceneCallbacks.push(cb)
  },
  cleanup(cb) {
    this.__cleanupCallbacks.push(cb)
  },  
  run() {
    if(!this.currentScene) return
    this.__sceneCallbacks.forEach(cb => cb())
  }
}


class Game {
  constructor() {
    this.scene = 'menu'
  }
  goTo(newScene) {
    this.scene
  }
}