import { WebSocket } from "ws"
import Player from "./Player"
import * as THREE from "three"
import PowerUp, { PowerUpStates, PowerUpTypes } from "./Powerup"
import { Iengine } from "./Interface"
import { MatchState } from "src/matches/match.entity"

const SIMTICKRATE = 60
const TICKRATE = 30

function collisionBoxCyl(box: THREE.Mesh, cyl: THREE.Mesh, cylR: number) {
    box.geometry.computeBoundingBox()
    box.updateMatrixWorld()
    const Cbox = box.geometry.boundingBox?.clone()
    Cbox?.applyMatrix4(box.matrixWorld)
    const Csphere = new THREE.Sphere(cyl.position, cylR)
    return Cbox?.intersectsSphere(Csphere)
}

export function collisionBoxBox(box1: THREE.Mesh, box2: THREE.Mesh) {
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

function getPowerUpInfos(list: Map<number, PowerUp>) {
    let res = new Array<{
        id: number
        typeName: string
        pos: { x: number; z: number }
        sender: number | null
        state: PowerUpStates
    }>()
    list.forEach((pu) => {
        res.push(pu.getBasicInfos())
    })
    return res
}

export default class Lobby {
    _id: number
    _player_one: WebSocket
    _player_two: WebSocket
    _spectators: WebSocket[]
    _puProb: number

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

    _gameRules: {
        maxPoints: number
        enablePowerUp: boolean
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

    // Function to unregister the current lobby from the game service once the game was won.
    private unregister: (lobby: Lobby) => void
    private changeState: (state: MatchState) => void
    private changeScore: (pOne: number, pTwo: number) => void
    private onGameWon: (winner: number) => void

    constructor(
        id: number,
        player_one: WebSocket,
        pOneName: string,
        player_two: WebSocket,
        pTwoName: string,
        gameSettings: {
            enablePowerUp?: boolean
            maxPoints?: number
        } = {
            enablePowerUp: true,
            maxPoints: 5,
        },
        unregister: (lobby: Lobby) => void,
        changeState: (state: MatchState) => void,
        changeScore: (pOne: number, pTwo: number) => void,
        onGameWon: (winner: number) => void
    ) {
        console.log(gameSettings)

        this._gameRules = {
            enablePowerUp: gameSettings.enablePowerUp,
            maxPoints: gameSettings.maxPoints,
        }
        this._id = id
        this._player_one = player_one
        this._player_two = player_two
        this._puProb = 0
        this.unregister = unregister
        this.changeState = changeState
        this.changeScore = changeScore
        this._spectators = new Array<WebSocket>()
        this.onGameWon = onGameWon
        this._currentData = {
            players: {
                one: new Player(1, pOneName, 0xffffff, "player1"),
                two: new Player(2, pTwoName, 0xffffff, "player2"),
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
            powerUp: new Map<number, PowerUp>(),
        }
        this._lastHit = this._currentData.players.one
        this.initScene()
    }

    emit(socket: WebSocket, event: string, data: any = undefined) {
        socket.send(JSON.stringify({ event: event, data: data }))
    }

    whoAmI(socket: WebSocket) {
        if (socket === this._player_one) this.emit(socket, "game:youAre", "one")
        else if (socket === this._player_two)
            this.emit(socket, "game:youAre", "two")
        else this.emit(socket, "game:youAre", "spec")
    }

    start() {
        this.sendData()
        this.whoAmI(this._player_one)
        this.whoAmI(this._player_two)

        this._simData.running = true
        this._simData.last = Date.now()
        this._simData.interval = setInterval(() => {
            this.simulate()
        }, 1000 / SIMTICKRATE)
        this._simData.sendInterval = setInterval(() => {
            this.sendData()
        }, 1000 / TICKRATE)
        setTimeout(() => {
            this.startRound()
        }, 0)
    }

    joinSpec(socket: WebSocket) {
        this._spectators.push(socket)
        console.log(this._spectators.length)
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

    movePlayer(player: string, data: any, fromServer = false) {
        if (
            (this._currentData.players[player].last < data.time ||
                fromServer) &&
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
            if (!fromServer) this._currentData.players[player].last = data.time
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
        this._engine.powerUp.forEach((pu) => {
            pu._destroy()
        })
        this._engine.powerUp.clear()
        this.broadcast("game:stopRound")
    }

    startRound() {
        this._roundRunning = true

        const p1s = this._currentData.players.one.score
        const p2s = this._currentData.players.two.score

        let dir = 0
        if (p1s === 0 && p2s === 0) dir = Math.random() > 0.5 ? -1 : 1
        else {
            if (this._lastHit == this._currentData.players.one) dir = -1
            else dir = 1
        }

        this._currentData.quoit.speed.z = dir * 10

        this.broadcast("game:startRound")
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
        this.changeState(
            player == this._currentData.players.one
                ? MatchState.PLAYER_ONE_WON
                : MatchState.PLAYER_TWO_WON
        )
        this.onGameWon(player.id)
    }

    playerScore(player: Player) {
        player.score += 1
        this.changeScore(
            this._currentData.players.one.score,
            this._currentData.players.two.score
        )
        this.stopRound()
        this.resetRound()
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

    syncMeshs() {
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

        if (this._gameRules.enablePowerUp && this._roundRunning) {
            this._puProb++
            let rand = Math.round(Math.random() * 500000)
            let spawn = rand < this._puProb
            if (spawn) {
                this._puProb = 0
                let lastID = 0
                this._engine.powerUp.forEach((pu) => {
                    if (pu._id > lastID) lastID = pu._id
                })
                lastID++

                const posX = Math.random() * 12 - 6
                const posZ = Math.random() * 12 - 6

                const values = Object.values(PowerUpTypes)
                const type = values[Math.floor(Math.random() * values.length)]

                this._engine.powerUp.set(
                    lastID,
                    new PowerUp({
                        ctx: this._engine,
                        lobbyCtx: this,
                        id: lastID,
                        type: type,
                        x: posX,
                        z: posZ,
                        r: 1,
                    })
                )
            }
        }

        try {
            const delta = (Date.now() - this._simData.last) / 1000
            this.syncMeshs()
            const quoit = this._engine.objects.get("quoit") as THREE.Mesh
            const wallP = this._engine.objects.get("map_border1") as THREE.Mesh
            const wallN = this._engine.objects.get("map_border2") as THREE.Mesh
            const playerOne = this._engine.objects.get("player1") as THREE.Mesh
            const playerTwo = this._engine.objects.get("player2") as THREE.Mesh
            {
                this._engine.powerUp.forEach((pu) => {
                    if (
                        pu.collisionCheck(quoit, this._currentData.quoit.radius)
                    ) {
                        pu.trigger(this._lastHit)
                    }
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
            running: this._roundRunning,
        })
        this.broadcast("game:powerupCompare", {
            list: getPowerUpInfos(this._engine.powerUp),
        })
    }

    sendPowerup(client: WebSocket, id: number) {
        this.emit(client, "game:powerupSync", {
            id: id,
            pu: this._engine.powerUp.get(id)?.getBasicInfos(),
        })
    }

    stop(unregister = true) {
        if (unregister) {
            this.unregister(this)
        }
        this._simData.running = false
        clearInterval(this._simData.interval)
        clearInterval(this._simData.sendInterval)
    }

    disconnect(socket: WebSocket) {
        if (socket === this._player_one) {
            this.playerWin(this._currentData.players.two)
        } else if (socket === this._player_two) {
            this.playerWin(this._currentData.players.one)
        }
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
