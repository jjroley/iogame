

class SceneHandler {
  constructor() {
    this.currentScene = null
    this.scenes = {}
    this.__sceneCallbacks = []
    this.__cleanupCallbacks = []
    this.__resizeCallbacks = []
    this.frameId = 0
    this.animated = false

    this.init()
  }
  init() {
    this._draw = () => {
      if(!this.animated) return
      this.run()
      this.frameId = window.requestAnimationFrame(this._draw)
    }
    this._resize = () => {
      this.__resizeCallbacks.forEach(cb => cb())
    }
    window.addEventListener('resize', this._resize)
  }
  to(newScene, data) {
    if(newScene in this.scenes) {
      if(this.__cleanupCallbacks.length) {
        this.__cleanupCallbacks.forEach(cleanup => cleanup())
      }
      this.cancelLoop()
      this.__cleanupCallbacks = []
      this.__sceneCallbacks = []
      this.__resizeCallbacks = []
      this.currentScene = newScene
      this.scenes[newScene](data)
      this._resize()
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
  resize(cb) {
    this.__resizeCallbacks.push(cb)
  }
  cleanup(cb) {
    this.__cleanupCallbacks.push(cb)
  } 
  run() {
    if(!this.currentScene) return
    this.__sceneCallbacks.forEach(cb => cb())
  }
}
