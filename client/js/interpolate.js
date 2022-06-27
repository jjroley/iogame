Math.TWO_PI = Math.PI * 2

import { lerp } from '../../shared/math'

export const interpolateObject = (a, b, c) => {
  if(!b) return a
  const interp = {}
  for(var key in a) {
    if(key === 'angle') {
      interp[key] = interpolateAngle(a[key], b[key], c)
    }else if(key === 'x' || key === 'y') {
      interp[key] = lerp(a[key], b[key], c)
    }else {
      interp[key] = a[key]
    }
  }
  return interp
}

export const interpolateObjects = (a, b, c) => {
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
}
