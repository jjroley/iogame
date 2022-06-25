
const RENDER_DELAY = 100

let gameUpdates = []
let firstServerTimestamp = 0
let gameStart = 0


const processGameUpdate = (update) => {
  if(!firstServerTimestamp) {
    gameStart = Date.now()
    firstServerTimestamp = update.timestamp
  }
  gameUpdates.push(update)

  const baseUpdate = getBaseUpdate()
  if(baseUpdate > 0) {
    gameUpdates.splice(0, baseUpdate)
  }
}

const currentServerTime = () => {
  return firstServerTimestamp + (Date.now() - gameStart) - RENDER_DELAY;
}

const getBaseUpdate = () => {
  const serverTime = currentServerTime();
  for (let i = gameUpdates.length - 1; i >= 0; i--) {
    if (gameUpdates[i].timestamp <= serverTime) {
      return i;
    }
  }
  return -1
}

function getCurrentState() {
  if (!firstServerTimestamp) {
    return {};
  }

  const base = getBaseUpdate();
  const serverTime = currentServerTime();

  // If base is the most recent update we have, use its state.
  // Otherwise, interpolate between its state and the state of (base + 1).
  if (base < 0 || base === gameUpdates.length - 1) {
    return gameUpdates[gameUpdates.length - 1];
  } else {
    const baseUpdate = gameUpdates[base];
    const next = gameUpdates[base + 1];
    const ratio = (serverTime - baseUpdate.timestamp) / (next.timestamp - baseUpdate.timestamp);
    return {
      me: interpolateObject(baseUpdate.me, next.me, ratio, 'x', 'y', 'angle'),
      others: interpolateObjects(baseUpdate.others, next.others, ratio, 'x', 'y', 'angle'),
      bullets: interpolateObjects(baseUpdate.bullets, next.bullets, ratio, 'x', 'y')
    };
  }
}

const socket = io()

const connect = () => {
  return new Promise(resolve => {
    socket.on('connect', resolve)
  })
}




connect().then(() => {
  scene.to('menu')
})