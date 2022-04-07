import { Injectable } from "@nestjs/common"
import { Match, MatchState } from "src/matches/match.entity"
import { MatchesService } from "src/matches/matches.service"
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
        private matches: MatchesService
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
            one,
            this.playerOneInfos.nickname,
            two,
            this.playerTwoInfos.nickname,
            this.close.bind(this),
            this.updateEntityState.bind(this)
        )
        this.lobbies.add(lobby)
        this.players.set(one, lobby)
        this.players.set(two, lobby)

        lobby.start()
    }

    close(lobby: Lobby) {
        console.log("Close lobby", this.lobbies.size)
        if (this.lobbies.has(lobby)) {
            lobby.stop(false)
            this.players.delete(lobby._player_one)
            this.players.delete(lobby._player_two)
            this.lobbies.delete(lobby)
        }
    }

    async updateEntityState(state: MatchState) {
        this.matchEntity.state = state
        this.matchEntity = await this.matches.update(this.matchEntity)
    }

    lobbyBySocket(socket: WebSocket) {
        return this.players.get(socket)
    }
}
