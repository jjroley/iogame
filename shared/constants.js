
const BLOCK_SIZE = 100
const MAP_SIZE = 10
const MAP_W = MAP_SIZE * BLOCK_SIZE
const MAP_H = MAP_SIZE * BLOCK_SIZE

const PLAYER_STATS = [
  { 
    name: "peasant",
    health: 50,
    weapon: "fists",
    speed: 200,
    cost: 0
  },
  {
    name: "guard",
    health: 50,
    weapon: "knife",
    speed: 200,
    cost: 100
  },
  {
    name: "knight",
    health: 80,
    weapon: "sword",
    speed: 250,
    cost: 1000
  },
  {
    name: "archer",
    health: 50,
    weapon: 'bow',
    speed: 250,
    cost: 5000
  },
  { 
    name: "giant",
    health: 150,
    weapon: 'giantFists',
    speed: 150,
    cost: 10000,
    size: 95
  },
]

const WEAPON_STATS = {
  fists: {
    damage: 5,
    cooldown: 0.2,
    range: 10
  },
  knife: {
    damage: 1, 
    cooldown: 0.1,
    range: 15,
  },
  sword: {
    damage: 15,
    cooldown: 0.5,
    range: 25
  },
  bow: {
    damage: 0,
    projectileType: 'arrow',
    cooldown: 1
  },
  giantFists: {
    damage: 50,
    cooldown: 0.5,
    range: 20
  }
}

module.exports = {
  BLOCK_SIZE,
  MAP_SIZE,
  PLAYER_SIZE: 50,
  MAP_H,
  MAP_W,
  PLAYER_STATS,
  WEAPON_STATS
}