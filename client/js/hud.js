

const root = document.getElementById('canvas-overlay')

class Element {
  constructor(type) {
    this.elem = document.createElement(type)
    root.appendChild(this.elem)
  }
  append(type) {
    const newElem = document.createElement(type)
    this.elem.appendChild(newElem)
    return this
  }
  text(msg) {
    this.elem.innerText = msg
    return this
  }
  on(listener, callback) {
    this.elem.addEventListener(listener, callback)
    return this
  }
  style(s, t) {
    this.elem.style[s] = t
    return this
  }
  addClass(...classes) {
    classes.forEach(c => {
      this.elem.classList.add(c)
    })
    return this
  }
  removeClass(...classes) {
    classes.forEach(c => {
      this.elem.classList.remove(c)
    })
    return this
  }
  off(listener, callback) {
    this.elem.removeEventListener(listener, callback)
    return this
  }
  children(arr) {
    console.log(arr)
    arr.forEach(child => {
      console.log('child', child)
      this.elem.appendChild(child.elem)
    })
    return this
  }
}

Element.create = function(type) {
  return new Element(type)
}

export class Popup {
  constructor(template, data, options) {
    this.elem = template(data)
    this.elem.style('opacity', 0)
    if(options.style) {
      switch(options.style) {
        case 'fade-in-up':
          this.elem.style('transform', 'translateY(100px)')
          this.elem.style('transition', '0.3s ease forwards')
          this.elem.style('transform', 'translateY(0)')
        break;
      }
    }
    setTimeout(() => {
      this.elem.style('display', 'none')
    }, options.time || 5000)
  }
}
Popup.create = function(...args) {
  return new Popup(...args)
}

export const requestJoinTeamTemplate = (props) => {
  return Element.create('div').children([
    Element.create('div').text(`${props.name} wants to join your team`),
    Element.create('button').text('Accept').on('click', props.accept),
    Element.create('button').text('Reject').on('click', props.reject)
  ])
}
