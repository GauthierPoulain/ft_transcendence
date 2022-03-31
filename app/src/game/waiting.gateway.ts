import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
} from "@nestjs/websockets"
import { AuthSocketService } from "src/auth/auth-socket.service"
import { Match, MatchState } from "src/matches/match.entity"
import { MatchesService } from "src/matches/matches.service"
import { SocketsService } from "src/sockets/sockets.service"
import { User } from "src/users/entities/user.entity"
import { WebSocket } from "ws"
import { GameWaitingDto } from "./game.dto"
import { GameService } from "./game.service"

@WebSocketGateway()
export class GameWaitingGateway {
    constructor(
        private auth: AuthSocketService,
        private sockets: SocketsService,
        private game: GameService,
        private matches: MatchesService
    ) {}

    // Tell the server the user is ready for the game to start.
    @SubscribeMessage("game.waiting.ready")
    async iamready(
        @ConnectedSocket() socket: WebSocket,
        @MessageBody() body: GameWaitingDto
    ) {
        // An anonymous socket cannot register for a game waitlist.
        if (!this.auth.isConnected(socket)) {
            return
        }

        // Getting match before checking sockets in room to avoid TOCTOU.
        let match =
            body.id === 0
                ? undefined
                : await this.matches.get({ where: { id: body.id } })

        const sockets = [...this.sockets.findSockets(`gamewaiting.${body.id}`)]

        if (sockets.length === 0) {
            // If the match's id is zero for matchmaking or the match exists and is in waiting mode,
            // register the socket.
            if (
                body.id === 0 ||
                (!match && match.state === MatchState.WAITING)
            ) {
                this.sockets.join(socket, `gamewaiting.${body.id}`)
            }
            return
        }

        const [waiting] = sockets

        if (
            this.auth.socketUserId(waiting) === this.auth.socketUserId(socket)
        ) {
            socket.send(
                JSON.stringify({
                    event: "game.waiting.error.alreadysubscribed",
                    data: body,
                })
            )
        }

        this.sockets.removeRoom(`gamewaiting.${body.id}`)

        if (!match) {
            match = new Match()
            match.matchmaking = body.id === 0
            match.playerOne = { id: this.auth.socketUserId(waiting) } as User
            match.playerTwo = { id: this.auth.socketUserId(socket) } as User
            match.state = MatchState.PLAYING
            match = await this.matches.create(match)
        } else {
            match.state = MatchState.PLAYING
            match = await this.matches.update(match)
        }

        for (const s of [waiting, socket]) {
            s.send(
                JSON.stringify({
                    event: "game.waiting.success",
                    data: { id: match.id },
                })
            )
        }

        const [playerOne, playerTwo] =
            this.auth.socketUserId(waiting) === match.playerOneId
                ? [waiting, socket]
                : [socket, waiting]

        this.game.open(playerOne, playerTwo, match)
    }

    // Tell the server the user is not ready for the game to start.
    @SubscribeMessage("game.waiting.unready")
    iamunready(
        @ConnectedSocket() socket: WebSocket,
        @MessageBody() body: GameWaitingDto
    ) {
        this.sockets.leave(socket, `gamewaiting.${body.id}`)
    }
}
