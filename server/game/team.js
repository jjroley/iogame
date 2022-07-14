const shortid = require("shortid")
const { playerHandler } = require("./player")


class Team {
  constructor(name, id) {
    this.name = name
    this.id = id
    this.leader = null
    this.members = []
  }
  getData() {
    return {
      name: this.name,
      id: this.id
    }
  }
}

const teamHandler = {
  teams: {},
  createTeam(name, creator) {
    const id = shortid()
    const team = new Team(name, id)
    team.leader = creator.id
    team.members.push(leader.id)
    this.teams[id] = team
  },
  joinTeam(player, teamId) {
    const team = this.teams[teamId]
    if(!team) return 'Team does not exist'
    if(player.teamId) return "You cannot join another team while you are on a team"
    team.members.push(player.id)
    player.teamId = team.id
    playerHandler.sendMessageTo(player.id, 'joined-team', { name: team.name })
  },
  requestJoin(player, teamId) {
    const team = this.teams[teamId]
    if(!team) return "Team does not exist"
    playerHandler.sendMessageTo(team.leaderId, 'request-join', { id: player.id, username: player.username })
  },
  removeTeam(id) {
    delete this.teams[id]
  },
  setLeaderOfTeam(playerId, teamId) {
    const team = this.teams[teamId]
    const player = playerHandler.players[playerId]
    if(!team || !player) return
    team.leaderId = player.id
    playerHandler.sendMessageTo(playerId, 'new-team-leader', { name: team.name, id: team.id })
  },
  leaveTeam(player) {
    if(!player.teamId) return
    const team = this.teams[player.teamId]
    if(!team) return

    // get rid of team member that left
    team.members = team.members.filter(m => m !== player.teamId)

    // delete team if it has no more members
    if(!team.members.length) {
      return this.removeTeam(team.id)
    }
    
    // if player was leader of team
    if(team.leaderId === player.id) {
      // pick a new leader for the team (for now just the person with the most xp)
      const topMember = team.members.map(m => {
        return playerHandler.players[m]
      }).filter(m => !!m)
        .sort((a, b) => b.coins - a.coins)[0]
      // set that user to be the leader
      this.setLeaderOfTeam(topMember.id, team.id)
    }

    player.teamId = null
  },
}

module.exports = { teamHandler }