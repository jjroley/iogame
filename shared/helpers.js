
export const throttle = (time, cb) => {
  let prev = 0
  return (...args) => {
    const now = Date.now()
    if(now - prev > time) {
      prev = now
      return cb(...args)
    }
  }
}

export const lerp = (a, b, c) => a + (b - a) * c

export const dist = (x1, y1, x2, y2) => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

export const constrain = (num, a, b) => {
  return Math.min(Math.max(num, a), b)
}

module.exports = { throttle, lerp, dist, constrain }