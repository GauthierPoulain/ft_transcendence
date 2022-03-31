import { Injectable } from "@nestjs/common"
import { Match } from "src/matches/match.entity"
import { WebSocket } from "ws"
import Lobby from "./class/Lobby"

@Injectable()
export class GameService {
    private lobbies: Set<Lobby> = new Set()
    private players: Map<WebSocket, Lobby> = new Map()

    constructor() {}

    open(one: WebSocket, two: WebSocket, match: Match) {
        // TODO: Use match with lobby to update state
        const lobby = new Lobby(one, two, this.close.bind(this))

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

    lobbyBySocket(socket: WebSocket) {
        return this.players.get(socket)
    }
}
