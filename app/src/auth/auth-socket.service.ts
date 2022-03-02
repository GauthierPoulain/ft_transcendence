import { Injectable } from "@nestjs/common"
import { WebSocket } from "ws"
import { AuthService } from "./auth.service"

@Injectable()
export class AuthSocketService {
    // Association between a socket and an user id
    private sockets: Map<WebSocket, number> = new Map()

    constructor(private auth: AuthService) {}

    async login(socket: WebSocket, token: string): Promise<number> {
        const { sub } = await this.auth.verify(token)

        this.sockets.set(socket, sub)
        return sub
    }

    logout(socket: WebSocket): void {
        this.sockets.delete(socket)
    }

    isConnected(socket: WebSocket): boolean {
        return this.sockets.has(socket)
    }

    // Return a list of websocket owned by any user inside the id list.
    getConnections(userIds: number[]): WebSocket[] {
        return [...this.sockets.entries()]
            .filter(([_, id]) => userIds.includes(id))
            .map(([socket]) => socket)
    }

    broadcast(users: number[] | null, event: string, data: any) {
        const message = JSON.stringify({ event, data })

        for (const [socket, user] of this.sockets.entries()) {
            if (users === null || users.includes(user)) {
                socket.send(message)
            }
        }
    }
}
