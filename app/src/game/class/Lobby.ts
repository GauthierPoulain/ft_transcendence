import { WebSocket } from "ws"
import Player from "./Player"
import * as THREE from "three"

function collisionBoxCyl(box: THREE.Mesh, cyl: THREE.Mesh, cylR: number) {
    box.geometry.computeBoundingBox()
    box.updateMatrixWorld()
    const Cbox = box.geometry.boundingBox?.clone()
    Cbox?.applyMatrix4(box.matrixWorld)
    const Csphere = new THREE.Sphere(cyl.position, cylR)
    return Cbox?.intersectsSphere(Csphere)
}

function collisionBoxBox(box1: THREE.Mesh, box2: THREE.Mesh) {
    box1.geometry.computeBoundingBox()
    box1.updateMatrixWorld()
    box2.geometry.computeBoundingBox()
    box2.updateMatrixWorld()
    const Cbox1 = box1.geometry.boundingBox?.clone()
    Cbox1?.applyMatrix4(box1.matrixWorld)
    const Cbox2 = box2.geometry.boundingBox?.clone()
    Cbox2?.applyMatrix4(box2.matrixWorld)
    if (Cbox2) return Cbox1?.intersectsBox(Cbox2)
    return false
}

export default class Lobby {
    _player_one: WebSocket
    _player_two: WebSocket
    _spectators: WebSocket[]

    _map = {
        depth: 25,
        width: 15,
        height: 0.5,
        color: 0x0000ff,
        separator: { depth: 0.5, color: 0xffffff },
        borders: { width: 0.3, height: 1.25, color: 0xffffff },
    }

    _engine: {
        scene: THREE.Scene
        objects: Map<string, any>
    }
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
        this.initScene()
    }

    emit(socket: WebSocket, event: string, data: any = undefined) {
        socket.send(JSON.stringify({ event: event, data: data }))
    }

    start() {
        this.broadcast("game.ready", true)
        this.emit(this._player_one, "game.youAre", "one")
        this.emit(this._player_two, "game.youAre", "two")

        this._simData.running = true
        this._simData.interval = setInterval(() => {
            this.simulate()
        }, 100)
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
        this.simulate()
    }

    simulate() {
        if (!this._simData.running) return
        try {
            const delta = (Date.now() - this._simData.last) / 1000
            this.sendData()
            this._simData.last = Date.now()
        } catch (error) {
            console.error(error)
            this.stop()
            return false
        }
    }

    sendData() {
        this.broadcast("game.syncData", this._currentData)
    }

    stop() {
        this._simData.running = false
        clearInterval(this._simData.interval)
    }

    private addObj(name: string, obj: any) {
        this._engine.objects.set(name, obj)
        this._engine.scene.add(obj)
    }

    private initScene() {
        {
            const geo = new THREE.BoxGeometry(
                this._map.borders.width,
                this._map.borders.height,
                this._map.depth
            )
            const mat = new THREE.MeshBasicMaterial({
                color: this._map.borders.color,
            })
            const obj = new THREE.Mesh(geo, mat)
            obj.position.set(
                this._map.width / 2 + this._map.borders.width / 2,
                this._map.borders.height / 2 - this._map.height,
                0
            )
            this.addObj("map_border1", obj)
        }
        {
            const geo = new THREE.BoxGeometry(
                this._map.borders.width,
                this._map.borders.height,
                this._map.depth
            )
            const mat = new THREE.MeshBasicMaterial({
                color: this._map.borders.color,
            })
            const obj = new THREE.Mesh(geo, mat)
            obj.position.set(
                -(this._map.width / 2 + this._map.borders.width / 2),
                this._map.borders.height / 2 - this._map.height,
                0
            )
            this.addObj("map_border2", obj)
        }
        {
            let player = this._currentData.players.one
            const geo = new THREE.BoxGeometry(1, 0.3, 0.4)
            const mat = new THREE.MeshBasicMaterial({ color: player.color })
            const obj = new THREE.Mesh(geo, mat)
            obj.position.set(0, 0.3, 11.5)
            obj.castShadow = true
            this.addObj("player1", obj)
        }
        {
            let player = this._currentData.players.two
            const geo = new THREE.BoxGeometry(1, 0.3, 0.4)
            const mat = new THREE.MeshBasicMaterial({ color: player.color })
            const obj = new THREE.Mesh(geo, mat)
            obj.position.set(0, 0.3, -11.5)
            this.addObj("player2", obj)
        }
        {
            const geo = new THREE.CylinderGeometry(1, 1, 0.3, 20)
            const mat = new THREE.MeshBasicMaterial({ color: 0xffffff })
            const obj = new THREE.Mesh(geo, mat)
            obj.position.set(0, 0.3, 0)
            this.addObj("quoit", obj)
        }
    }
}
