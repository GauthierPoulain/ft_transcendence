import { Injectable } from "@nestjs/common";
import { WebSocket } from "ws";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthSocketService {
    // Association between a socket and an user id
    private sockets: Map<WebSocket, number> = new Map()

    constructor(private auth: AuthService) {
    }

    async login(socket: WebSocket, token: string): Promise<void> {
        const { sub } = await this.auth.verify(token)

        this.sockets.set(socket, sub)
    }

    logout(socket: WebSocket): void {
        this.sockets.delete(socket)
    }

    isConnected(userId: number): boolean {
        return [...this.sockets.values()].some((id) => id === userId)
    }

    // Return a list of websocket owned by any user inside the id list.
    getConnections(userIds: number[]): WebSocket[] {
        return [...this.sockets.entries()]
            .filter(([_, id]) => userIds.includes(id))
            .map(([socket]) => socket)
    }
}
