import { WebSocket } from "ws"
import Player from "./Player"
import * as THREE from "three"
import PowerUp from "./Powerup"
import { Iengine } from "./Interface"

const TICKRATE = 60

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

    _engine: Iengine
    _lastHit: Player
    _currentData: {
        players: { one: Player; two: Player }
        quoit: {
            x: number
            z: number
            radius: number
            color: number
            speed: { x: number; z: number }
        }
    }

    _gameRules = {
        maxPoints: 3,
        enablePowerUp: false,
    }

    _roundRunning = false

    _map = {
        depth: 25,
        width: 15,
        height: 0.5,
        color: 0x0000ff,
        separator: { depth: 0.5, color: 0xffffff },
        borders: { width: 0.3, height: 1.25, color: 0xffffff },
    }

    _simData: {
        running: boolean
        last: number
        interval: any
        sendInterval: any
    } = {
        running: false,
        last: Date.now(),
        interval: undefined,
        sendInterval: undefined,
    }

    constructor(player_one: WebSocket, player_two: WebSocket) {
        this._player_one = player_one
        this._player_two = player_two
        this._spectators = new Array<WebSocket>()
        this._currentData = {
            players: {
                one: new Player(1, "GogoLeDozo", 0xffffff, "player1"),
                two: new Player(2, "bot", 0xffffff, "player2"),
            },
            quoit: {
                x: 0,
                z: 0,
                radius: 0.5,
                color: 0xffffff,
                speed: { x: 0, z: 0 },
            },
        }
        this._engine = {
            scene: new THREE.Scene(),
            objects: new Map<string, any>(),
            powerUps: new Map<number, PowerUp>(),
        }
        this._lastHit = this._currentData.players.one
        this.initScene()
    }

    emit(socket: WebSocket, event: string, data: any = undefined) {
        socket.send(JSON.stringify({ event: event, data: data }))
    }

    start() {
        this.sendData()
        this.emit(this._player_one, "game:youAre", "one")
        this.emit(this._player_two, "game:youAre", "two")

        this._simData.running = true
        this._simData.last = Date.now()
        this._simData.interval = setInterval(() => {
            this.simulate()
        }, 1)
        this._simData.sendInterval = setInterval(() => {
            this.sendData()
        }, 1000 / TICKRATE)
        setTimeout(() => {
            this.startRound()
        }, 0)
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

    movePlayer(player: string, data: any) {
        if (
            this._currentData.players[player].last < data.time &&
            this._roundRunning
        ) {
            this.syncMeshs()
            const wallP = this._engine.objects.get("map_border1") as THREE.Mesh
            const wallN = this._engine.objects.get("map_border2") as THREE.Mesh
            const meshPlayer = this._engine.objects.get(
                this._currentData.players[player].meshName
            ) as THREE.Mesh
            const dir = this._currentData.players[player].x - data.x
            if (
                (dir < 0 && !collisionBoxBox(meshPlayer, wallP)) ||
                (dir > 0 && !collisionBoxBox(meshPlayer, wallN))
            ) {
                this._currentData.players[player].x = data.x
            }

            this._currentData.players[player].last = data.time
        }
    }

    resetRound() {
        this._currentData.players.one.width = 3
        this._currentData.players.two.width = 3
        this._currentData.players.one.x = 0
        this._currentData.players.two.x = 0
        this._currentData.quoit.x = 0
        this._currentData.quoit.z = 0
        this._currentData.quoit.speed.x = 0
        this._currentData.quoit.speed.z = 0
        this.sendData(true)
    }

    stopRound() {
        this._roundRunning = false
        this._engine.powerUps.forEach(pu => {
            pu._destroy();
        })
        this.broadcast("game:stopRound")
    }

    startRound() {
        this._roundRunning = true
        this._currentData.quoit.speed.z = 10
        this.broadcast("game:startRound")
        new PowerUp(this._engine, this, 1, "default", 3, 0, 1);
    }

    checkVictory() {
        if (this._currentData.players.one.score >= this._gameRules.maxPoints) {
            return true
        } else if (
            this._currentData.players.two.score >= this._gameRules.maxPoints
        ) {
            return true
        } else return false
    }

    playerWin(player: Player) {
        this.stopRound()
        this.stop()
        console.log(`${player.name} win the game`)
        this.broadcast("game:win", { player: player })
    }

    playerScore(player: Player) {
        player.score += 1
        this.resetRound()
        this.stopRound()
        this.updateHUD()
        if (this.checkVictory()) {
            this.playerWin(player)
        } else {
            this.broadcast("game:score", { player: player })
            setTimeout(() => {
                this.startRound()
            }, 4000)
        }
    }

    updateHUD() {
        this.sendData(true)
        this.broadcast("game:updateHUD")
    }

    private syncMeshs() {
        const quoit = this._engine.objects.get("quoit") as THREE.Mesh
        const playerOne = this._engine.objects.get("player1") as THREE.Mesh
        const playerTwo = this._engine.objects.get("player2") as THREE.Mesh

        quoit.position.x = this._currentData.quoit.x
        quoit.position.z = this._currentData.quoit.z
        quoit.scale.x = this._currentData.quoit.radius
        quoit.scale.z = this._currentData.quoit.radius

        playerOne.position.x = this._currentData.players.one.x
        playerOne.scale.x = this._currentData.players.one.width

        playerTwo.position.x = this._currentData.players.two.x
        playerTwo.scale.x = this._currentData.players.two.width
    }

    simulate() {
        if (!this._simData.running) return
        try {
            const delta = (Date.now() - this._simData.last) / 1000
            this.syncMeshs()
            const quoit = this._engine.objects.get("quoit") as THREE.Mesh
            const wallP = this._engine.objects.get("map_border1") as THREE.Mesh
            const wallN = this._engine.objects.get("map_border2") as THREE.Mesh
            const playerOne = this._engine.objects.get("player1") as THREE.Mesh
            const playerTwo = this._engine.objects.get("player2") as THREE.Mesh
            {
                this._engine.powerUps.forEach((pu) => {
                    if (
                        pu.collisionCheck(quoit, this._currentData.quoit.radius)
                    )
                        pu.trigger(this._lastHit)
                })
                if (
                    collisionBoxCyl(
                        playerOne,
                        quoit,
                        this._currentData.quoit.radius
                    )
                ) {
                    this._lastHit = this._currentData.players.one
                    this._currentData.quoit.speed.z = -Math.abs(
                        this._currentData.quoit.speed.z
                    )
                    let xSpeed = -(
                        this._currentData.players.one.x -
                        this._currentData.quoit.x
                    )
                    this._currentData.quoit.speed.x += xSpeed * 3
                } else if (
                    collisionBoxCyl(
                        playerTwo,
                        quoit,
                        this._currentData.quoit.radius
                    )
                ) {
                    this._lastHit = this._currentData.players.two
                    this._currentData.quoit.speed.z = Math.abs(
                        this._currentData.quoit.speed.z
                    )
                    let xSpeed = -(
                        this._currentData.players.two.x -
                        this._currentData.quoit.x
                    )
                    this._currentData.quoit.speed.x += xSpeed * 3
                }

                if (
                    collisionBoxCyl(
                        wallP,
                        quoit,
                        this._currentData.quoit.radius
                    )
                ) {
                    this._currentData.quoit.speed.x = -Math.abs(
                        this._currentData.quoit.speed.x
                    )
                } else if (
                    collisionBoxCyl(
                        wallN,
                        quoit,
                        this._currentData.quoit.radius
                    )
                ) {
                    this._currentData.quoit.speed.x = Math.abs(
                        this._currentData.quoit.speed.x
                    )
                }
            }
            {
                this._currentData.quoit.x +=
                    this._currentData.quoit.speed.x * delta
                this._currentData.quoit.z +=
                    this._currentData.quoit.speed.z * delta
            }
            {
                playerTwo.position.x = this._currentData.quoit.x
            }
            {
                if (this._currentData.quoit.z > this._map.depth / 2)
                    this.playerScore(this._currentData.players.two)
                else if (this._currentData.quoit.z < -this._map.depth / 2)
                    this.playerScore(this._currentData.players.one)
            }
            this._simData.last = Date.now()
        } catch (error) {
            console.error(error)
            this.stop()
            this.broadcast("game:kill")
            return false
        }
    }

    sendData(force: boolean = false) {
        this.broadcast("game:syncData", {
            data: this._currentData,
            time: Date.now(),
            force: force,
        })
    }

    stop() {
        this._simData.running = false
        clearInterval(this._simData.interval)
        clearInterval(this._simData.sendInterval)
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
