

module.exports = {
  throttle: (time, cb) => {
    let prev = 0
    return (...args) => {
      const now = Date.now()
      if(now - prev > time) {
        prev = now
        return cb(...args)
      }
    }
  }
}

