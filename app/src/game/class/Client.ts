import { v4 as uuidv4 } from "uuid"
import { WebSocket } from "ws"

export default class Client {
    id: string
    user: any = undefined
    _ws: WebSocket

    constructor(ws: WebSocket) {
        this._ws = ws
        this.id = uuidv4()
    }

    emit(event: string, data: any = null) {
        this._ws.send(JSON.stringify({ event: event, data: data }))
    }
}
