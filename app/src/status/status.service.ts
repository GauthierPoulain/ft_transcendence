import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { SocketsService } from "src/sockets/sockets.service";

@Injectable()
export class StatusService {
    // Map of all connected users with their status.
    // A status of 0 means online, otherwise it's the current game id.
    private users: Map<number, number> = new Map()

    constructor(private sockets: SocketsService) {

    }

    find() {
        return this.users
    }

    setOnline(userId: number) {
        this.users.set(userId, 0)
        this.publish("created", { id: userId, status: 0 })
    }

    setOffline(userId: number) {
        if (this.users.has(userId)) {
            this.users.delete(userId)
            this.publish("removed", { id: userId })
        }
    }

    @OnEvent("socket.auth")
    onAuthentication({ userId }) {
        if (!this.users.has(userId)) {
            this.setOnline(userId)
        }
    }

    @OnEvent("socket.disconnect")
    onSocketDisconnect({ userId }) {
        if (userId) {
            if (this.sockets.findSockets(`users.${userId}`).size == 0) {
                this.setOffline(userId)
            }
        }
    }

    private publish(event: string, data: any) {
        this.sockets.publish(
            ["all"],
            `status.${event}`,
            data
        )
    }
}
