import { WebSocket } from "ws"
import Player from "./Player"

export default class Lobby {
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
            speed: { x: number; xM: number; z: number }
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
        this._currentData = {
            players: {
                one: new Player("pl1", 0xffffff, "player1"),
                two: new Player("pl2", 0xffffff, "player2"),
            },
            quoit: {
                x: 0,
                z: 0,
                radius: 0.5,
                color: 0xffffff,
                speed: { x: 0, xM: 3, z: 0 },
            },
        }
    }

    emit(socket: WebSocket, event: string, data: any = undefined) {
        socket.send(JSON.stringify({ event: event, data: data }))
    }

    start() {
        this.broadcast("game.ready", true)
        this.emit(this._player_one, "game.youAre", "one")
        this.emit(this._player_two, "game.youAre", "two")
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

    movePlayer(player: string, x: number) {
        this._currentData.players[player].x = x
        this.sendData()
    }

    simulate() {}

    sendData() {
        this.broadcast("game.syncData", this._currentData)
    }

    stop() {
        this._simData.running = false
        clearInterval(this._simData.interval)
    }
}
