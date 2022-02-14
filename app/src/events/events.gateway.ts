// import { UseGuards } from "@nestjs/common";
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets"
import { Server, WebSocket } from "ws"
import { v4 as uuidv4 } from "uuid"

class Client {
    id: string
    user: any = undefined
    room: Room | null = null
    _ws: WebSocket

    constructor(ws: WebSocket) {
        this._ws = ws
        this.id = uuidv4()
    }

    emit(event: string, data: any = null) {
        this._ws.send(JSON.stringify({ event: event, data: data }))
    }
}

class RoomMember {
    client: Client
    YPos: number = 0

    constructor(client: Client) {
        this.client = client
    }
}

class Room {
    name: string
    _host: Client
    _members: Map<Client, RoomMember>
    _ball: { XPos: number; YPos: number } = { XPos: 0, YPos: 0 }
    _ready: boolean = false

    constructor(host: Client, name: string) {
        console.log("new room", name)

        this._members = new Map<Client, RoomMember>()
        this.name = name
        this._host = host
        this.join(host)
    }

    join(client: Client) {
        if (this._members.size >= 2) throw new Error("Room is full")
        this._members.set(client, new RoomMember(client))
        client.room = this
        console.log("%s join room %s", client.id, this.name)
        client.emit("room:joinSuccess")
        if (this._members.size == 2) this._ready = true
        this.broadcast("room:infos", {
            name: this.name,
            host: this._host.id,
            ready: this._ready,
        })
    }

    leave(client: Client) {
        this._members.delete(client)

        if (this._members.size > 0) {
            console.log("change host")
            let newHost = this._members.keys().next().value
            this._host = newHost
        }
        this._ready = false
        this.broadcast("room:infos", {
            name: this.name,
            host: this._host.id,
            ready: this._ready,
        })
        console.log("%s leave room %s", client.id, this.name)
    }

    broadcast(event: string, data?: any, except?: Client) {
        this._members.forEach((m) => {
            if (!except || m.client != except) m.client.emit(event, data)
        })
    }

    movePlayer(client: Client, YPos: number) {
        this._members.get(client).YPos = YPos
        this.broadcast(
            "game:playerMove",
            { player: client.id, YPos: YPos },
            client
        )
    }

    moveball(client: Client, XPos: number, YPos: number) {
        if (client == this._host) {
            this._ball.XPos = XPos
            this._ball.YPos = YPos
            this.broadcast("game:ballMove", this._ball, this._host)
        }
    }
}

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server
    _clients: Map<WebSocket, Client>
    _rooms: Map<string, Room>

    constructor() {
        this._clients = new Map<WebSocket, Client>()
        this._rooms = new Map<string, Room>()
    }

    public handleConnection(s: WebSocket): void {
        this._clients.set(s, new Client(s))
        let client = this._clients.get(s)
        console.info("[webSocket][%s] client connected", client.id)
        client.emit("client:identify", { id: client.id })
        client.emit("auth:request")
    }

    public handleDisconnect(s: WebSocket): void {
        let client = this._clients.get(s)
        let room = client.room
        if (room) client.room.leave(client)
        console.info("[webSocket][%s] client disconnected", client.id)
        this._clients.delete(s)
    }

    @SubscribeMessage("auth:response")
    client_auth(s: WebSocket, data: any) {
        //TODO: le truc avec les tokens
    }

    @SubscribeMessage("room:join")
    room_join(s: WebSocket, data: any) {
        let client = this._clients.get(s)

        let room = this._rooms.get(data.name)
        if (!room) {
            let room = new Room(client, data.name)
            this._rooms.set(room.name, room)
        } else {
            try {
                room.join(client)
            } catch (error) {
                console.log(error)

                client.emit("room:joinFail", error)
            }
        }
    }

    @SubscribeMessage("room:leave")
    room_leave(s: WebSocket, data: any) {
        let client = this._clients.get(s)
        let room = client.room
        if (room) {
            room.leave(client)
            if (room._members.size <= 0) this._rooms.delete(room.name)
        }
    }

    @SubscribeMessage("game:movePlayer")
    game_moveplayer(s: WebSocket, data: any) {
        let client = this._clients.get(s)
        let room = client.room
        if (room) {
            client.room.movePlayer(client, data.YPos)
        }
    }

    @SubscribeMessage("game:moveBall")
    game_moveball(s: WebSocket, data: any) {
        let client = this._clients.get(s)
        let room = client.room
        if (room) {
            room.moveball(client, data.XPos, data.YPos)
        }
    }
}
