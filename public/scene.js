

class SceneHandler {
  constructor() {
    this.currentScene = null
    this.scenes = {}
    this.__sceneCallbacks = []
    this.__cleanupCallbacks = []
    this.__frameId = 0
    this.animated = false

    this._draw = () => {
      if(!this.animated) return
      this.run()
      this.frameId = window.requestAnimationFrame(this._draw)
    }
  }
  to(newScene, data) {
    if(newScene in this.scenes) {
      if(this.__cleanupCallbacks.length) {
        this.__cleanupCallbacks.forEach(cleanup => cleanup())
      }
      this.cancelLoop()
      this.__cleanupCallbacks = []
      this.__sceneCallbacks = []
      this.currentScene = newScene
      this.scenes[newScene](data)
    }
  }
  use(name, cb) {
    this.scenes[name] = cb
  }
  loop(cb) {
    if(!this.animated) this.beginLoop()
    this.__sceneCallbacks.push(cb)
  }
  beginLoop() {
    this.animated = true
    this.frameId = window.requestAnimationFrame(this._draw)
  }
  cancelLoop() {
    this.animated = false
    window.cancelAnimationFrame(this.frameId)
  }
  cleanup(cb) {
    this.__cleanupCallbacks.push(cb)
  } 
  run() {
    if(!this.currentScene) return
    this.__sceneCallbacks.forEach(cb => cb())
  }
}
