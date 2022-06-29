const { BLOCK_SIZE, MAP_SIZE } = require('../../shared/constants')


let placedTiles = []
let tileData = new Array(MAP_SIZE ** 2).fill(0)

const initTileData = () => {
  tileData = new Array(MAP_SIZE ** 2).fill(0)
  placedTiles = []
}

const tileCollide = (ex, ey, ew, eh) => {
  const minX = Math.floor((ex - ew * 0.5) / BLOCK_SIZE)
  const minY = Math.floor((ey - eh * 0.5) / BLOCK_SIZE)
  const maxX = Math.floor((ex + ew * 0.5) / BLOCK_SIZE)
  const maxY = Math.floor((ey + eh * 0.5) / BLOCK_SIZE)
  // console.log(minX, minY, maxX, maxY)
  let tiles = []
  for(let x = minX; x <= maxX; x++) {
    for(let y = minY; y <= maxY; y++) {
      if(x < 0 || x >= MAP_SIZE || y < 0 || y >= MAP_SIZE) continue
      if(tileData[x + y * MAP_SIZE]) {
        tiles.push({
          x: x * BLOCK_SIZE + BLOCK_SIZE * 0.5,
          y: y * BLOCK_SIZE + BLOCK_SIZE * 0.5
        })      
      }
    }
  }
  return tiles.length ? tiles : false
}

const placeTileData = (x, y, t) => {
  if(x < 0 || x >= MAP_SIZE || y < 0 || y >= MAP_SIZE) return false
  tileData[x + y * MAP_SIZE] = t
  placedTiles.push([x, y, t])
}

const destroyTile = (x, y) => {
  tileData[x + y * MAP_SIZE] = 0
  placedTiles = placeTiles.filter(t => t[0] !== x && t[1] !== y)
}

module.exports = { tileCollide, placeTileData, placedTiles, destroyTile, initTileData }


