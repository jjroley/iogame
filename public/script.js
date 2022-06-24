

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let width, height, scaleRatio = 1

function onResize() {
  scaleRatio = Math.max(1, 800 / window.innerWidth)
  width = canvas.width = window.innerWidth * scaleRatio
  height = canvas.height = window.innerHeight * scaleRatio
}
onResize()
window.onresize = onResize()

let mouseX = 0, mouseY = 0;

const usernameForm = document.getElementById('username-form')
const usernameInput = document.getElementById('username')
const joinGameBtn = document.getElementById('join-btn')
const deathModal = document.getElementById('death-modal')
const playAgainBtn = document.getElementById('play-again-btn')


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


const scene = new SceneHandler()


scene.use('menu', () => {
  usernameForm.classList.remove('hidden')
  
  const checkForInput = e => {
    e.preventDefault()
    socket.emit('join game', usernameInput.value)
    console.log("Requesting to join", usernameInput.value)
    usernameInput.value = ''
    scene.to('game')
  }

  usernameForm.addEventListener('submit', checkForInput)
  
  ctx.fillStyle = 'blue'
  ctx.fillRect(0, 0, width, height)
  
  scene.cleanup(() => {
    usernameForm.removeEventListener('submit', checkForInput)
    usernameForm.classList.add('hidden')
  })
})

scene.use('game', () => {
  startCapturingInput()
  
  gameUpdates = []
  firstServerTimestamp = 0
  gameStart = 0
  
  socket.on('gameupdate', processGameUpdate)
  socket.on('death', data => scene.to('death', data))
  
  // updated 60 times per second
  scene.loop(() => {
    const state = getCurrentState()
    renderData(state)
    if(state.me) {
      inputCode.angle = Math.atan2(cam.mouseY - state.me.y, cam.mouseX - state.me.x)
      socket.emit('input', inputCode)
    }
  })
  
  // called when user is leaving scene
  scene.cleanup(() => {
    stopCapturingInput()
    socket.off('death')
  })
})

scene.use('death', (data) => {
  deathModal.classList.remove('hidden')

  deathModal.querySelector('div').innerText = "Shot by " + data.shotBy
  
  const goToMenu = () => scene.to('menu')
  
  playAgainBtn.addEventListener('click', goToMenu)
  
  scene.cleanup(() => {
    deathModal.classList.add('hidden')
    playAgainBtn.removeEventListener('click', goToMenu)
  })
})

// function draw() {
//   
//   window.requestAnimationFrame(draw)
// }

// window.requestAnimationFrame(draw)

scene.run()