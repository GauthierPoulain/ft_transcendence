import { Injectable } from "@nestjs/common"
import { AuthSocketService } from "src/auth/auth-socket.service"
import { Match, MatchState } from "src/matches/match.entity"
import { MatchesService } from "src/matches/matches.service"
import { StatusService } from "src/status/status.service"
import { AchievementsService } from "src/users/achievements.service"
import { User } from "src/users/entities/user.entity"
import { UsersService } from "src/users/users.service"
import { WebSocket } from "ws"
import Lobby from "./class/Lobby"

@Injectable()
export class GameService {
    private lobbies: Set<Lobby> = new Set()
    private players: Map<WebSocket, Lobby> = new Map()
    private matchEntity: Match
    private playerOneInfos: User
    private playerTwoInfos: User

    constructor(
        private readonly users: UsersService,
        private matches: MatchesService,
        private achievements: AchievementsService,
        private status: StatusService,
        private auth: AuthSocketService
    ) {}

    async open(one: WebSocket, two: WebSocket, match: Match) {
        this.matchEntity = match

        this.playerOneInfos = await this.users.find(
            this.matchEntity.playerOneId
        )
        this.playerTwoInfos = await this.users.find(
            this.matchEntity.playerTwoId
        )

        const lobby = new Lobby(
            match.id,
            one,
            this.playerOneInfos.nickname,
            two,
            this.playerTwoInfos.nickname,
            {
                enablePowerUp: match.powerups,
                maxPoints: 5,
            },
            this.close.bind(this),
            this.updateEntityState.bind(this),
            this.updateScore.bind(this),
            this.onGameWin.bind(this)
        )
        this.lobbies.add(lobby)
        this.players.set(one, lobby)
        this.players.set(two, lobby)

        this.status.setInGame(this.playerOneInfos.id, match.id)
        this.status.setInGame(this.playerTwoInfos.id, match.id)

        lobby.start()
    }

    close(lobby: Lobby) {
        console.log("Close lobby", this.lobbies.size)
        if (this.lobbies.has(lobby)) {
            lobby.stop(false)
            this.status.setNotInGame(this.auth.socketUserId(lobby._player_one))
            this.status.setNotInGame(this.auth.socketUserId(lobby._player_two))
            this.players.delete(lobby._player_one)
            this.players.delete(lobby._player_two)
            this.lobbies.delete(lobby)
        }
    }

    async updateEntityState(state: MatchState) {
        this.matchEntity.state = state
        this.matchEntity = await this.matches.update(this.matchEntity)
    }

    async updateScore(pOne: number, pTwo: number) {
        console.log(pOne, pTwo)

        this.matchEntity.scorePOne = pOne
        this.matchEntity.scorePTwo = pTwo
        this.matchEntity = await this.matches.update(this.matchEntity)
    }

    async onGameWin(winner: number) {
        await this.achievements.achieve(winner, "win_one_match")
    }

    lobbyBySocket(socket: WebSocket) {
        return this.players.get(socket)
    }

    lobbyBySpec(socket: WebSocket) {
        return [...this.lobbies.values()].find((lobby) =>
            lobby._spectators.includes(socket)
        )
    }

    lobbyById(id: number) {
        return [...this.lobbies.values()].find((lobby) => lobby._id == id)
    }
}
