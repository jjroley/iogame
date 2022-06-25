import '../../css/style.css'

import scene from "./scene"
import { renderData, wrap, cam } from "./render"
import server from './serverUpdate'

export const FONT = 'Titan One, sans-serif'

export const canvas = document.getElementById('canvas')
export const ctx = canvas.getContext('2d')

export let width = 0, height, scaleRatio = 1
export let mouseX = 0, mouseY = 0;

function onResize() {
  scaleRatio = Math.max(1, 800 / window.innerWidth)
  width = canvas.width = window.innerWidth * scaleRatio
  height = canvas.height = window.innerHeight * scaleRatio
}
onResize()
window.addEventListener('resize', onResize)

const usernameForm = document.getElementById('username-form')
const usernameInput = document.getElementById('username')
const deathModal = document.getElementById('death-modal')
const playAgainBtn = document.getElementById('play-again-btn')

let inputCode = { angle: 0 }
function handleKeyDown(e) {
  if(e.keyCode === 87 || e.keyCode === 38) {
    inputCode.up = true
  }
  if(e.keyCode === 83 || e.keyCode === 40) {
    inputCode.down = true
  }
  if(e.keyCode === 65 || e.keyCode === 37) {
    inputCode.left = true
  }
  if(e.keyCode === 68 || e.keyCode === 39) {
    inputCode.right = true
  }
}
function handleKeyUp(e) {
  if(e.keyCode === 87 || e.keyCode === 38) {
    inputCode.up = false
  }
  if(e.keyCode === 83 || e.keyCode === 40) {
    inputCode.down = false
  }
  if(e.keyCode === 65 || e.keyCode === 37) {
    inputCode.left = false
  }
  if(e.keyCode === 68 || e.keyCode === 39) {
    inputCode.right = false
  }
}
function handleClick(e) {
  server.send('shoot', e.mouseButton)
}
function handleMouse(e) {
  mouseX = e.clientX * scaleRatio
  mouseY = e.clientY * scaleRatio
}
function startCapturingInput() {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('click', handleClick)
  window.addEventListener('mousemove', handleMouse)
}
function stopCapturingInput() {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('click', handleClick)
  window.removeEventListener('mousemove', handleMouse)
}

server.connect().then(() => {
  scene.to('menu')
})

scene.use('menu', () => {
  usernameForm.classList.remove('hidden')
  usernameInput.focus()

  const checkForInput = e => {
    e.preventDefault()
    server.send('join game', usernameInput.value)
    console.log("Requesting to join", usernameInput.value)
    usernameInput.value = ''
    scene.to('game')
  }

  usernameForm.addEventListener('submit', checkForInput)

  scene.resize(() => {
    ctx.fillStyle = '#0a0'
    ctx.fillRect(0, 0, width, height)
  
    wrap(() => {
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `100px ${FONT}`
      ctx.fillStyle = 'white'
      ctx.fillText("Paintball.io", width / 2, height / 4)
    })
  })
  
  scene.cleanup(() => {
    usernameForm.removeEventListener('submit', checkForInput)
    usernameForm.classList.add('hidden')
  })
})

scene.use('game', () => {
  inputCode = { angle: 0 }
  startCapturingInput()
  
  server.reset()

  let blocks = []

  server.on('gameupdate', update => {
    server.process(update)
  })
  server.on('death', data => scene.to('death', data))
  server.on('initialState', data => {
    console.log(data)
    blocks = data.blocks
  })
  
  // updated 60 times per second
  scene.loop(() => {
    const state = server.getCurrentState()
    renderData({ ...state, blocks })
    if(state.me) {
      inputCode.angle = Math.atan2(cam.mouseY - state.me.y, cam.mouseX - state.me.x)
      server.send('input', inputCode)
    }
  })
  
  // called when user is leaving scene
  scene.cleanup(() => {
    stopCapturingInput()
    server.off('death')
    server.off('gameupdate')
    server.off('initialState')
  })
})

scene.use('death', (data) => {
  deathModal.showModal()

  deathModal.querySelector('div').innerText = "Shot by " + data.shotBy
  
  const goToMenu = () => scene.to('menu')
  
  playAgainBtn.addEventListener('click', goToMenu)
  
  scene.cleanup(() => {
    deathModal.open = false
    deathModal.classList.add('hidden')
    playAgainBtn.removeEventListener('click', goToMenu)
  })
})

scene.run()