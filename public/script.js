

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const width = canvas.width = window.innerWidth
const height = canvas.height = window.innerHeight

let mouseX = 0, mouseY = 0;

const usernameForm = document.getElementById('username-form')
const usernameInput = document.getElementById('username')
const joinGameBtn = document.getElementById('join-btn')

const loadUserForm = () => {
  usernameForm.style.display = 'block'
  usernameForm.addEventListener('submit', e => {
    e.preventDefault()
    socket.emit('join game', usernameInput.value)
    console.log("Requesting to join", usernameInput.value)
    usernameInput.value = ''
    usernameForm.style.display = 'none'
  })
}


const keys = []


const playerInput = {
  
}
const legalKeys = [87,65,83,68,38,37,40,39]
const inputCode = { angle: 0 }

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
  socket.emit('shoot', e.mouseButton)
}
function handleMouse(e) {
  mouseX = e.clientX
  mouseY = e.clientY
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




function draw() {
  // console.log(getBaseUpdate())
  const state = getCurrentState()
  renderData(state)
  if(state.me) {
    inputCode.angle = Math.atan2(cam.mouseY - state.me.y, cam.mouseX - state.me.x)

    socket.emit('input', inputCode)
  }
  window.requestAnimationFrame(draw)
}

window.requestAnimationFrame(draw)