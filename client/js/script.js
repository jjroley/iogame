import '../css/style.css'
import scene from "./scene"
import { downloadAssets, renderData } from "./render"
import server from './serverUpdate'
import { canvas } from './canvas'
import { cam } from './camera'
import { BLOCK_SIZE } from '../../shared/constants'
import { pointCornerRectCollide } from '../../shared/collide'
import Particle from './particle'
import { Popup, requestJoinTeamTemplate } from './hud'

const usernameForm = document.getElementById('username-form')
const usernameInput = document.getElementById('username')
const playBtn = document.getElementById('join-game')
const deathModal = document.getElementById('death-modal')
const playAgainBtn = document.getElementById('play-again-btn')

let inputCode = {}

function handleWhateverKey(e) {
  if(e.keyCode === 87 || e.keyCode === 38) {
    return inputCode.up = true
  }
  if(e.keyCode === 83 || e.keyCode === 40) {
    return inputCode.down = true
  }
  if(e.keyCode === 65 || e.keyCode === 37) {
    return inputCode.left = true
  }
  if(e.keyCode === 68 || e.keyCode === 39) {
    return inputCode.right = true
  }
}
function handleKeyDown(e) {
  if(handleWhateverKey(e)) {
    server.send('input', { type: 'move', keys: inputCode })
  }
  if(/^\d$/.test(e.key)) {
    server.send('upgrade', {
      type: 'character',
      character: parseInt(e.key) - 1
    })
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
  server.send('input', { type: 'move', keys: inputCode })
}


function startCapturingInput() {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
}
function stopCapturingInput() {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
}

Promise.all([ scene.connect, downloadAssets ]).then(() => {
  scene.to('menu')
})

let whavm = false

scene.use('menu', () => {
  usernameForm.classList.remove('hidden')

  if(whavm) {
    usernameForm.style.background = 'red'
  }

  whavm = true

  usernameInput.focus()

  const checkForInput = e => {
    console.log('whatever')
    e.preventDefault()
    server.send('join game', usernameInput.value)
    console.log("Requesting to join", usernameInput.value)
    usernameInput.value = ''
    scene.to('game')
  }

  usernameInput.addEventListener('keydown', (e) => {
    if(e.key === "Enter") {
      checkForInput(e)
    }
  })

  playBtn.addEventListener('click', checkForInput)

  scene.resize(() => {
    canvas.graphics((ctx) => {
      ctx.fillStyle = '#0a0'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `100px sans-serif`
      ctx.fillStyle = 'white'
      ctx.fillText("Paintball.io", canvas.width / 2, canvas.height / 4)
    })
  })
  
  scene.cleanup(() => {
    usernameForm.classList.add('hidden')
  })
})

scene.use('game', () => {
  let loading = true

  inputCode = {}
  startCapturingInput()
  
  server.reset()

  let tiles = []
  let particles = []
  let notifs = []

  function loadTiles(data) {
    return data.map(t => {
      return {
        x: t[0] * BLOCK_SIZE,
        y: t[1] * BLOCK_SIZE,
        type: t[2],
        health: t[3]
      }
    })
  }

  function joinTeam(team) {
    server.send('join-team', team.id)
    notifs.push({ text: "Sent request to join team " + team.name })
  }

  function updateTeams(teams) {
    const teamElem = document.getElementById('teams')
    teamElem.innerHTML = ''
    for(var i = 0; i < teams.length; i++) {
      let t = document.createElement('div')
      t.innerText = teams[i].name
      t.onclick = () => {
        joinTeam(teams[i])
      }
      teamElem.appendChild(t)
    }
  }

  server.on('gameupdate', update => {
    server.processUpdate(update)
    updateTeams(update.teams)
  })
  server.on('death', data => scene.to('death', data))
  server.on('initialState', data => {
    tiles = loadTiles(data.tiles)
    loading = false
  })
  server.on('tiles', data => {
    tiles = loadTiles(data)
  })
  server.on('strike', data => {
    // console.log('strike', data)
    const color = data.type === 'block' ? [100, 100, 100] : [255, 255, 0]
    for(var i = 0; i < 20; i++) {
      particles.push(new Particle(data.x, data.y, color, Math.random() * 100))
    }
  })
  server.on('joined-team', team => {
    notifs.push({ text: "You have been accepted to team " + team.name })
  })

  function handleClick(e) {


    server.send('input', { type: 'attack' })
  }
  window.addEventListener('mousedown', handleClick)
    
  Popup.create(requestJoinTeamTemplate, {
    name: "Jake Sloan",
    accept: () => console.log("accepted"),
    reject: () => console.log("rejected")
  }, { style: 'fade-in-up' })

  // creating teams
  const createTeamBtn = document.getElementById('create-team')
  createTeamBtn.classList.remove('hidden')
  createTeamBtn.addEventListener('click', toggleTeamCreateModal)
  function toggleTeamCreateModal() {
    const nameTeam = document.getElementById('name-team')
    nameTeam.classList.toggle('hidden')
    if(nameTeam.style.display === 'none') {
      nameTeam.removeEventListener('keydown', submitTeamName)
    }else {
      nameTeam.addEventListener('keydown', submitTeamName)
    }
    function submitTeamName(e) {
      // if(nameTeam.value === '') return
      if(e.key === 'Enter') {
        e.preventDefault()
        server.send('create-team', { name: nameTeam.value })
        notifs.push({ text: `Created team ${nameTeam.value}` })
        // nameTeam.removeEventListener('keydown', submitTeamName)
        nameTeam.classList.add('hidden')
        createTeamBtn.classList.add('hidden')
      }
    }
  }

  
  // updated 60 times per second
  scene.loop(() => {
    if(loading) {
      canvas.graphics((ctx) => {
        ctx.fillStyle = '#0a0'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = 'white'
        ctx.font = '30px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText("Loading...", canvas.width / 2, canvas.height / 2)
      })
    }else {
      const state = server.getCurrentState()
      renderData({ ...state, tiles, particles })
      canvas.graphics((ctx) => {
        for(var i = particles.length - 1; i >= 0; i--) {
          particles[i].update(scene.dt)
          if(particles[i].dead) {
            particles.splice(i, 1)
            continue;
          }
        }
      })

      canvas.graphics((ctx) => {
        console.log(notifs.length)
        for(var i = 0; i < notifs.length; i++) {
          ctx.fillStyle = '#aaa'
          ctx.fillRect(10, 10 + i * 50, 200, 40)
          ctx.fillStyle = 'black'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.font = '20px sans-serif'
          ctx.fillText(notifs[i].text, 105, 30 + i * 50)
        }
      })

      if(state.me) {
        server.send('input', { 
          type: "angle",
          angle: Math.atan2(cam.mouseY - state.me.y, cam.mouseX - state.me.x)
        })
      }
    }
  })
  
  // called when user is leaving scene
  scene.cleanup(() => {
    stopCapturingInput()
    window.removeEventListener('mousedown', handleClick)
    server.off('death')
    server.off('gameupdate')
    server.off('initialState')
  })
})

scene.use('death', (data) => {
  deathModal.showModal()

  deathModal.querySelector('div').innerText = "Killed by " + data.enemy
  
  const goToMenu = () => scene.to('menu')
  
  playAgainBtn.addEventListener('click', goToMenu)
  
  scene.cleanup(() => {
    deathModal.open = false
    playAgainBtn.removeEventListener('click', goToMenu)
  })
})

scene.run()