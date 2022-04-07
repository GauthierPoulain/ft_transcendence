import { Injectable } from "@nestjs/common"
import { Match, MatchState } from "src/matches/match.entity"
import { MatchesService } from "src/matches/matches.service"
import { WebSocket } from "ws"
import Lobby from "./class/Lobby"

@Injectable()
export class GameService {
    private lobbies: Set<Lobby> = new Set()
    private players: Map<WebSocket, Lobby> = new Map()
    private matchEntity: Match
    private matchesServ: MatchesService

    constructor() {}

    open(
        one: WebSocket,
        two: WebSocket,
        match: Match,
        matches: MatchesService
    ) {
        // TODO: Use match with lobby to update state
        this.matchEntity = match
        this.matchesServ = matches

        const lobby = new Lobby(
            one,
            two,
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
        this.matchEntity = await this.matchesServ.update(this.matchEntity)
    }

    lobbyBySocket(socket: WebSocket) {
        return this.players.get(socket)
    }
}
