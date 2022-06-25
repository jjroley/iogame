


module.exports = {
  pointCornerRectCollide: (x, y, rx, ry, rw, rh) => {
    return x > rx && x < rx + rw && y > ry && y < ry + rh
  },
  pointCenterRectCollide: (x, y, rx, ry, rw, rh) => {
    return Math.abs(rx - x) < rw * 0.5 && Math.abs(ry - y) < rh * 0.5
  },
  rectRectCollide: (ax, ay, aw, ah, bx, by, bw, bh) => {
    return Math.abs(bx - ax) * 2 < aw + bw && Math.abs(by - ay) * 2 < ah + bh
  }
}

