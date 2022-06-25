
 
module.exports = {
  dist: (x1, y1, x2, y2) => {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
  },
  lerp: (a, b, c) => a + (b - a) * c,
  constrain: (num, a, b) => {
    return Math.min(Math.max(num, a), b)
  }
}
