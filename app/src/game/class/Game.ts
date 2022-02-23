import { WebSocket } from "ws"
import Player from "./Player"

export default class Game {
    _player_one: WebSocket
    _player_two: WebSocket
    _spectators: WebSocket[]
    _currentData: {
        players: { one: Player; two: Player }
        quoit: {
            x: number
            z: number
            radius: number
            color: number
            speed: {
                x: number
                xMultiplicator: 3
                z: number
            }
        }
    }
    _simData: {
        running: boolean
        last: number
        interval: any
    } = {
        running: false,
        last: Date.now(),
        interval: undefined,
    }

    constructor(player_one: WebSocket, player_two: WebSocket) {
        this._player_one = player_one
        this._player_two = player_two
        this._spectators = new Array<WebSocket>()
    }

    private emit(socket: WebSocket, event: string, data: any = undefined) {
        socket.send(JSON.stringify({ event: event, data: data }))
    }

    start() {
        this.broadcast("game.ready", true)
    }

    joinSpec(socket: WebSocket) {
        this._spectators.push(socket)
    }

    leaveSpec(socket: WebSocket) {
        let index = this._spectators.indexOf(socket, 0)
        if (index != -1) this._spectators.splice(index, 1)
    }

    broadcast(event: string, data: any = undefined) {
        this.emit(this._player_one, event, data)
        this.emit(this._player_two, event, data)
        this._spectators.forEach((spec) => {
            this.emit(spec, event, data)
        })
    }

    simulate() {}

    stop() {
        this._simData.running = false
        clearInterval(this._simData.interval)
    }
}
