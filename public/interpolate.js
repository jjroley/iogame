Math.TWO_PI = Math.PI * 2

const lerp = (a, b, c) => a + (b - a) * c

const interpolateObject = (a, b, c) => {
  const interp = {}
  for(var key in a) {
    if(key === 'angle') {
      interp[key] = interpolateAngle(a[key], b[key], c)
    }else {
      interp[key] = lerp(a[key], b[key], c)
    }
    
  }
  return interp
}

const interpolateObjects = (a, b, c) => {
  if(a.length !== b.length) return
  return a.map((_a, i) => interpolateObject(_a, b.find(p => p.id === _a.id), c))
}

const interpolateAngle = (a, b, c) => {
  let angle = Math.abs(b - a)

  if(angle > Math.PI) {
    if(a > b) {
      return lerp(a, b + Math.TWO_PI, c)
    }else {
      return lerp(a, b - Math.TWO_PI, c)
    }
  }else {
    return lerp(a, b, c)
  }

  return angle * c
}
