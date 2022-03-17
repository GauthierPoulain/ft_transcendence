import { Injectable } from "@nestjs/common"
import WebSocket from "ws"

@Injectable()
export class SocketsService {
    private sockets: Map<WebSocket, Set<string>> = new Map()
    private rooms: Map<string, Set<WebSocket>> = new Map()

    join(socket: WebSocket, room: string) {
        if (!this.sockets.has(socket)) {
            this.sockets.set(socket, new Set())
        }

        if (!this.rooms.has(room)) {
            this.rooms.set(room, new Set())
        }

        this.sockets.get(socket).add(room)
        this.rooms.get(room).add(socket)
    }

    // Remove a socket from a room (destroying the room if it was the last socket)
    // but doesn't remove the room from the socket.
    private _remove_socket_from_room(socket: WebSocket, room: string) {
        const sockets = this.rooms.get(room)

        sockets.delete(socket)

        if (sockets.size === 0) {
            this.rooms.delete(room)
        }
    }

    // Remove a room from a socket (destroying the socet if it was the last room)
    // but doesn't remove the socket from the room.
    private _remove_room_from_socket(socket: WebSocket, room: string) {
        const rooms = this.sockets.get(socket)

        rooms.delete(room)

        if (rooms.size === 0) {
            this.sockets.delete(socket)
        }
    }

    leave(socket: WebSocket, room: string) {
        if (!this.sockets.has(socket)) {
            return
        }

        this._remove_socket_from_room(socket, room)
        this._remove_room_from_socket(socket, room)
    }

    deleteSocket(socket: WebSocket) {
        if (!this.sockets.has(socket)) {
            return
        }

        const rooms = this.sockets.get(socket)

        for (const room of rooms) {
            this._remove_socket_from_room(socket, room)
        }

        this.sockets.delete(socket)
    }

    removeRoom(room: string) {
        if (!this.rooms.has(room)) {
            return
        }

        const sockets = this.rooms.get(room)

        for (const socket of sockets) {
            this._remove_room_from_socket(socket, room)
        }

        this.rooms.delete(room)
    }

    publish(rooms: string[], event: string, data: any) {
        const sockets = new Set(
            rooms.flatMap((room) => [...(this.rooms.get(room) ?? [])])
        )
        const message = JSON.stringify({ event, data })

        for (const socket of sockets) {
            socket.send(message)
        }
    }

    // Return the list of socket for a given room
    findSockets(room: string): Set<WebSocket> {
        return this.rooms.get(room) ?? new Set()
    }
}
