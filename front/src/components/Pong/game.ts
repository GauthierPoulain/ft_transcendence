import Stats from "stats.js"
import {
    AmbientLight,
    BoxGeometry,
    Clock,
    CylinderGeometry,
    DodecahedronBufferGeometry,
    Mesh,
    MeshPhongMaterial,
    PCFSoftShadowMap,
    PerspectiveCamera,
    PointLight,
    REVISION,
    Scene,
    Sphere,
    sRGBEncoding,
    WebGLRenderer,
} from "three"

class Player {
    name: string
    score: number = 0
    x: number = 0
    width: number = 3
    color: number = 0xffffff
    meshName: string
    last: number
    id: number

    constructor(id: number, name: string, color: number, meshName: string) {
        this.id = id
        this.name = name
        this.color = color
        this.meshName = meshName
        this.last = Date.now()
    }
}

function collisionBoxCyl(box: Mesh, cyl: Mesh, cylR: number) {
    box.geometry.computeBoundingBox()
    box.updateMatrixWorld()
    const Cbox = box.geometry.boundingBox?.clone()
    Cbox?.applyMatrix4(box.matrixWorld)
    const Csphere = new Sphere(cyl.position, cylR)
    return Cbox?.intersectsSphere(Csphere)
}

function collisionCylCyl(cyl1: Mesh, cyl1R: number, cyl2: Mesh, cyl2R: number) {
    const Csp1 = new Sphere(cyl1.position, cyl1R)
    const Csp2 = new Sphere(cyl2.position, cyl2R)
    return Csp1.intersectsSphere(Csp2)
}

function collisionBoxBox(box1: Mesh, box2: Mesh) {
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

const PowerUpTypes = {
    // DEFAULT: {
    //     name: "DEFAULT",
    //     effect: (ctx: PowerUp) => {
    //         console.log(`template triggered by ${ctx._sender}`)
    //     },
    //     reset: (ctx: PowerUp) => {
    //         console.log(`template reset`)
    //     },
    //     initMesh: (ctx: PowerUp, x: number, z: number, r?: number) => {
    //         const geo = new DodecahedronBufferGeometry(r)
    //         const mat = new MeshPhongMaterial({
    //             color: 0xffffff,
    //         })
    //         let mesh = new Mesh(geo, mat)
    //         mesh.castShadow = true
    //         mesh.position.set(x, 0.3, z)
    //         ctx._ctx.scene.add(mesh)
    //         return mesh
    //     },
    //     animation: (ctx: PowerUp, delta: number) => {
    //         ctx._mesh.rotation.y += 3 * delta
    //     },
    //     time: 3000,
    // },
    BIGBAR: {
        name: "BIGBAR",
        effect: (ctx: PowerUp) => {
            console.log(`template triggered by ${ctx._sender}`)
            ctx._sender!.width = 5
        },
        reset: (ctx: PowerUp) => {
            console.log(`template reset`)
            ctx._sender!.width = 3
        },
        initMesh: (ctx: PowerUp, x: number, z: number, r?: number) => {
            const geo = new DodecahedronBufferGeometry(r)
            const mat = new MeshPhongMaterial({
                color: 0x00ffff,
            })
            let mesh = new Mesh(geo, mat)
            mesh.castShadow = true
            mesh.position.set(x, 0.3, z)
            ctx._ctx.scene.add(mesh)
            return mesh
        },
        animation: (ctx: PowerUp, delta: number) => {
            ctx._mesh.rotation.y += 3 * delta
        },
        time: 7000,
    },
    SMOLBAR: {
        name: "SMOLBAR",
        effect: (ctx: PowerUp) => {
            console.log(`template triggered by ${ctx._sender}`)

            if (ctx._sender === ctx._lobbyCtx._currentData.players.one) {
                ctx._lobbyCtx._currentData.players.two.width = 1
            } else {
                ctx._lobbyCtx._currentData.players.one.width = 1
            }
        },
        reset: (ctx: PowerUp) => {
            if (ctx._sender === ctx._lobbyCtx._currentData.players.one) {
                ctx._lobbyCtx._currentData.players.two.width = 3
            } else {
                ctx._lobbyCtx._currentData.players.one.width = 3
            }
        },
        initMesh: (ctx: PowerUp, x: number, z: number, r?: number) => {
            const geo = new DodecahedronBufferGeometry(r)
            const mat = new MeshPhongMaterial({
                color: 0x00ff00,
            })
            let mesh = new Mesh(geo, mat)
            mesh.castShadow = true
            mesh.position.set(x, 0.3, z)
            ctx._ctx.scene.add(mesh)
            return mesh
        },
        animation: (ctx: PowerUp, delta: number) => {
            ctx._mesh.rotation.y -= 3 * delta
        },
        time: 7000,
    },
    SPEED: {
        name: "SPEED",
        effect: (ctx: PowerUp) => {
            console.log(`template triggered by ${ctx._sender}`)

            ctx._lobbyCtx._currentData.quoit.speed.z =
                ctx._lobbyCtx._currentData.quoit.speed.z > 0 ? 20 : -20
        },
        reset: (ctx: PowerUp) => {
            ctx._lobbyCtx._currentData.quoit.speed.z =
                ctx._lobbyCtx._currentData.quoit.speed.z > 0 ? 10 : -10
        },
        initMesh: (ctx: PowerUp, x: number, z: number, r?: number) => {
            const geo = new DodecahedronBufferGeometry(r)
            const mat = new MeshPhongMaterial({
                color: 0xff0000,
            })
            let mesh = new Mesh(geo, mat)
            mesh.castShadow = true
            mesh.position.set(x, 0.3, z)
            ctx._ctx.scene.add(mesh)
            return mesh
        },
        animation: (ctx: PowerUp, delta: number) => {
            ctx._mesh.rotation.y -= 3 * delta
        },
        time: 5000,
    },
    // SPEED = "speed",
    // SMALL = "small",
    // RANDOMDIR = "random_direction",
}

enum PowerUpStates {
    IDLE = 0,
    TRIGGERED = 1,
    DESTROYED = 2,
}

class PowerUp {
    _pos: { x: number; z: number }
    _type: {
        name: string
        effect: (ctx: PowerUp) => void
        reset: (ctx: PowerUp) => void
        initMesh: (ctx: PowerUp, x: number, z: number, r?: number) => Mesh
        animation: (ctx: PowerUp, delta: number) => void
        time: number
    }
    _id: number
    _effect: () => void
    _reset: (fromDestroy: boolean) => void
    _animation: (delta: number) => void
    _sender: Player | null = null
    _notsender: Player | null = null
    _mesh: Mesh
    _ctx: Iengine
    _radius: number = 0
    _actionTimeout: any | undefined = undefined
    _state: PowerUpStates
    _lobbyCtx: {
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
    }

    constructor({
        ctx,
        currentData,
        id,
        type,
        x,
        z,
        r,
    }: {
        ctx: Iengine
        currentData: {
            players: { one: Player; two: Player }
            quoit: {
                x: number
                z: number
                radius: number
                color: number
                speed: { x: number; z: number }
            }
        }
        id: number
        type: {
            name: string
            effect: (ctx: PowerUp) => void
            reset: (ctx: PowerUp) => void
            initMesh: (ctx: PowerUp, x: number, z: number, r?: number) => Mesh
            animation: (ctx: PowerUp, delta: number) => void
            time: number
        }
        x: number
        z: number
        r?: number
    }) {
        this._pos = { x: x, z: z }
        this._id = id
        this._lobbyCtx = {
            _currentData: currentData,
        }
        this._ctx = ctx
        this._type = type
        this._mesh = this._type.initMesh(this, x, z)
        this._animation = (delta: number) => {
            this._type.animation(this, delta)
        }
        this._effect = () => {
            this._type.effect(this)
        }
        this._reset = (fromDestroy: boolean = false) => {
            this._type.reset(this)
            if (!fromDestroy) this._destroy()
        }
        this._state = PowerUpStates.IDLE
    }

    trigger(sender: Player) {
        this._sender = sender
        this._effect()
        this._state = PowerUpStates.TRIGGERED
        this._ctx.scene.remove(this._mesh)
    }

    animate(delta: number) {
        this._animation(delta)
    }

    collisionCheck(quoitMesh: Mesh, quoitRadius: number) {
        return collisionCylCyl(this._mesh, this._radius, quoitMesh, quoitRadius)
    }

    getBasicInfos() {
        return {
            id: this._id,
            typeName: this._type.name,
            pos: this._pos,
            sender: this._sender ? this._sender.id : null,
            state: this._state,
            radius: this._radius,
        }
    }

    _destroy() {
        if (this._actionTimeout !== undefined) clearTimeout(this._actionTimeout)
        if (this._reset && this._sender) this._reset(true)
        this._ctx.scene.remove(this._mesh)
        this._state = PowerUpStates.DESTROYED
    }
}

function hexToRgb(hex: number) {
    return {
        r: hex >> 16,
        g: (hex >> 8) & 255,
        b: hex & 255,
    }
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

function compareArrays(a1: Array<any>, a2: Array<any>): boolean {
    return (
        a1.length === a2.length &&
        a1.every(
            (value, index) =>
                JSON.stringify(value) === JSON.stringify(a2[index])
        )
    )
}

interface Iengine {
    scene: Scene
    renderer: WebGLRenderer
    camera: PerspectiveCamera
    objects: Map<string, any>
    powerUp: Map<number, PowerUp>
    clock: Clock
    animationFrame: number
    stats: Stats | null
}

export default class Game {
    _size: { x: number; y: number }
    _gameContainer: HTMLObjectElement

    _wsEmit: (event: string, data: any) => void

    _wsReady = false
    _engineReady = false
    _roundRunning = false

    _engine: Iengine

    _simData: {
        running: boolean
        last: number
        interval: any
    }

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

    _graphicConfig = {
        antiAliasing: true,
        shadows: true,
        renderResolution: 1,
        performanceMonitor: true,
    }

    _map = {
        depth: 25,
        width: 15,
        height: 0.5,
        color: 0x0000ff,
        separator: { depth: 0.5, color: 0xffffff },
        borders: { width: 0.3, height: 1.25, color: 0xffffff },
    }

    _keyPressed: Map<string, boolean>

    _gameAlertTimeout: any = null

    _whoAmI: string | null = null

    _lastHit: Player

    constructor(
        sendMessage: (event: string, data: any) => void,
        gameContainer: HTMLObjectElement
    ) {
        this._gameContainer = gameContainer
        this._size = {
            x: gameContainer.clientHeight,
            y: gameContainer.clientWidth,
        }
        this._wsEmit = sendMessage

        this._engine = {
            scene: new Scene(),
            renderer: new WebGLRenderer({
                antialias: this._graphicConfig.antiAliasing,
                powerPreference: "high-performance",
            }),
            camera: new PerspectiveCamera(
                50,
                this._size.x / this._size.y,
                0.1,
                40
            ),
            objects: new Map<string, any>(),
            powerUp: new Map<number, PowerUp>(),
            clock: new Clock(),
            animationFrame: 0,
            stats: this._graphicConfig.performanceMonitor ? new Stats() : null,
        }

        window.onresize = this.resizeRenderer.bind(this)

        this._keyPressed = new Map<string, boolean>()

        this._simData = {
            running: false,
            last: Date.now(),
            interval: undefined,
        }

        this._currentData = {
            players: {
                one: new Player(1, "pl1", 0xffffff, "player1"),
                two: new Player(2, "pl2", 0xffffff, "player2"),
            },
            quoit: {
                x: 0,
                z: 0,
                radius: 0.5,
                color: 0xffffff,
                speed: { x: 0, z: 0 },
            },
        }

        this._lastHit = this._currentData.players.one

        this.initEngine()
        this.initScene()
        this.syncSimulation()
        this.updateHUD()
        this.initKeyControl()
        this.render()
        this.startSimulation()
        this.setReady({ engine: true })
    }

    setReady({ engine, ws }: { engine?: boolean; ws?: boolean }) {
        if (engine !== undefined) this._engineReady = engine
        if (ws !== undefined) {
            this._wsReady = ws
            this._wsEmit("game:whoAmI", null)
        }
    }

    private resizeRenderer() {
        this._size = {
            x: this._gameContainer.clientWidth,
            y: this._gameContainer.clientHeight,
        }
        this._engine.renderer.setSize(
            this._size.x * this._graphicConfig.renderResolution,
            this._size.y * this._graphicConfig.renderResolution
        )
        this._engine.renderer.domElement.style.width = "100%"
        this._engine.renderer.domElement.style.height = `calc(100vh - ${
            document.getElementById("navbar")?.offsetHeight
        }px)`
        this._engine.camera.aspect = this._size.x / this._size.y
        this._engine.camera.updateProjectionMatrix()
    }

    currentPlayer(): Player | null {
        if (this._whoAmI === "one" || this._whoAmI === "two")
            return this._currentData.players[this._whoAmI]
        return null
    }

    syncMeshs() {
        const quoit = this._engine.objects.get("quoit") as Mesh
        const player1 = this._engine.objects.get("player1") as Mesh
        const player2 = this._engine.objects.get("player2") as Mesh

        quoit.position.x = this._currentData.quoit.x
        quoit.position.z = this._currentData.quoit.z
        quoit.scale.x = this._currentData.quoit.radius
        quoit.scale.z = this._currentData.quoit.radius

        player1.position.x = this._currentData.players.one.x
        player1.scale.x = this._currentData.players.one.width

        player2.position.x = this._currentData.players.two.x
        player2.scale.x = this._currentData.players.two.width
    }

    syncSimulation() {
        this.syncMeshs()
    }

    startSimulation() {
        this._simData.last = Date.now()
        this._simData.running = true
        this.syncSimulation()
    }

    stopSimulation() {
        this._simData.running = false
        clearInterval(this._simData.interval)
    }

    localSimulation() {
        if (!this._simData.running) return
        try {
            const delta = (Date.now() - this._simData.last) / 1000
            this.syncMeshs()
            const quoit = this._engine.objects.get("quoit") as Mesh
            const wallP = this._engine.objects.get("map_border1") as Mesh
            const wallN = this._engine.objects.get("map_border2") as Mesh
            const player1 = this._engine.objects.get("player1") as Mesh
            const player2 = this._engine.objects.get("player2") as Mesh

            if (this._whoAmI === "one" || this._whoAmI === "two") {
                const player = this._engine.objects.get(
                    this._currentData.players[this._whoAmI!].meshName
                ) as Mesh

                if (
                    this._roundRunning &&
                    this._keyPressed.get("ArrowLeft") &&
                    !this._keyPressed.get("ArrowRight")
                ) {
                    if (
                        !collisionBoxBox(
                            player,
                            this._whoAmI === "one" ? wallN : wallP
                        )
                    ) {
                        let tmpX = (this._currentData.players[
                            this._whoAmI!
                        ].x += (this._whoAmI === "one" ? -10 : 10) * delta)
                        this._wsEmit("game:playerMove", {
                            x: tmpX,
                            time: Date.now(),
                        })
                    }
                }
                if (
                    this._roundRunning &&
                    this._keyPressed.get("ArrowRight") &&
                    !this._keyPressed.get("ArrowLeft")
                ) {
                    if (
                        !collisionBoxBox(
                            player,
                            this._whoAmI === "one" ? wallP : wallN
                        )
                    ) {
                        let tmpX = (this._currentData.players[
                            this._whoAmI!
                        ].x += (this._whoAmI === "one" ? 10 : -10) * delta)
                        this._wsEmit("game:playerMove", {
                            x: tmpX,
                            time: Date.now(),
                        })
                    }
                }
            }
            if (
                collisionBoxCyl(player1, quoit, this._currentData.quoit.radius)
            ) {
                this._lastHit = this._currentData.players.one
                this._currentData.quoit.speed.z = -Math.abs(
                    this._currentData.quoit.speed.z
                )
                let xSpeed = -(
                    this._currentData.players.one.x - this._currentData.quoit.x
                )
                this._currentData.quoit.speed.x += xSpeed * 3
            } else if (
                collisionBoxCyl(player2, quoit, this._currentData.quoit.radius)
            ) {
                this._lastHit = this._currentData.players.two
                this._currentData.quoit.speed.z = Math.abs(
                    this._currentData.quoit.speed.z
                )
                let xSpeed = -(
                    this._currentData.players.two.x - this._currentData.quoit.x
                )
                this._currentData.quoit.speed.x += xSpeed * 3
            }
            if (collisionBoxCyl(wallP, quoit, this._currentData.quoit.radius)) {
                this._currentData.quoit.speed.x = -Math.abs(
                    this._currentData.quoit.speed.x
                )
            } else if (
                collisionBoxCyl(wallN, quoit, this._currentData.quoit.radius)
            ) {
                this._currentData.quoit.speed.x = Math.abs(
                    this._currentData.quoit.speed.x
                )
            }
            this._currentData.quoit.x += this._currentData.quoit.speed.x * delta
            this._currentData.quoit.z += this._currentData.quoit.speed.z * delta
            this._simData.last = Date.now()
        } catch (error) {
            console.log(error)
            this.stopSimulation()
            return false
        }
    }

    animate(delta: number) {
        this._engine.powerUp.forEach((pu) => {
            pu.animate(delta)
        })
    }

    render() {
        this._engine.stats?.begin()
        if (this._simData.running) this.localSimulation()
        this.animate(this._engine.clock.getDelta())
        this._engine.renderer.render(this._engine.scene, this._engine.camera)
        this._engine.stats?.end()
        this._engine.animationFrame = requestAnimationFrame(
            this.render.bind(this)
        )
    }

    private addObj(name: string, obj: any) {
        this._engine.objects.set(name, obj)
        this._engine.scene.add(obj)
    }

    initScene() {
        this._engine.camera.position.set(15, 20, 0)
        this._engine.camera.lookAt(0, 0, 0)
        {
            const light = new AmbientLight(0xffffff, 0.3)
            this.addObj("ambientLight", light)
        }
        {
            const light = new PointLight(0xffffff, 1, 40)
            light.position.set(12, 6, 0)
            light.castShadow = this._graphicConfig.shadows
            this.addObj("light", light)
        }
        {
            const geo = new BoxGeometry(
                this._map.width,
                this._map.height,
                this._map.depth / 2 - this._map.separator.depth / 2
            )
            const mat = new MeshPhongMaterial({ color: this._map.color })
            const obj = new Mesh(geo, mat)
            obj.position.set(
                0,
                -(this._map.height / 2),
                (this._map.depth - this._map.separator.depth) / 4 +
                    this._map.separator.depth / 2
            )
            obj.receiveShadow = true
            this.addObj("mapPannel_player1", obj)
        }
        {
            const geo = new BoxGeometry(
                this._map.width,
                this._map.height,
                this._map.depth / 2 - this._map.separator.depth / 2
            )
            const mat = new MeshPhongMaterial({ color: this._map.color })
            const obj = new Mesh(geo, mat)
            obj.position.set(
                0,
                -(this._map.height / 2),
                -(
                    (this._map.depth - this._map.separator.depth) / 4 +
                    this._map.separator.depth / 2
                )
            )
            obj.receiveShadow = true
            this.addObj("mapPannel_player2", obj)
        }
        {
            const geo = new BoxGeometry(
                this._map.width,
                this._map.height,
                this._map.separator.depth
            )
            const mat = new MeshPhongMaterial({
                color: this._map.separator.color,
            })
            const obj = new Mesh(geo, mat)
            obj.position.set(0, -(this._map.height / 2), 0)
            obj.receiveShadow = true
            this.addObj("map_separator", obj)
        }
        {
            const geo = new BoxGeometry(
                this._map.borders.width,
                this._map.borders.height,
                this._map.depth
            )
            const mat = new MeshPhongMaterial({
                color: this._map.borders.color,
            })
            const obj = new Mesh(geo, mat)
            obj.position.set(
                this._map.width / 2 + this._map.borders.width / 2,
                this._map.borders.height / 2 - this._map.height,
                0
            )
            obj.castShadow = true
            obj.receiveShadow = true
            this.addObj("map_border1", obj)
        }
        {
            const geo = new BoxGeometry(
                this._map.borders.width,
                this._map.borders.height,
                this._map.depth
            )
            const mat = new MeshPhongMaterial({
                color: this._map.borders.color,
            })
            const obj = new Mesh(geo, mat)
            obj.position.set(
                -(this._map.width / 2 + this._map.borders.width / 2),
                this._map.borders.height / 2 - this._map.height,
                0
            )
            obj.castShadow = true
            obj.receiveShadow = true
            this.addObj("map_border2", obj)
        }
        {
            let player = this._currentData.players.one
            const geo = new BoxGeometry(1, 0.3, 0.4)
            const mat = new MeshPhongMaterial({ color: player.color })
            const obj = new Mesh(geo, mat)
            obj.position.set(0, 0.3, 11.5)
            obj.castShadow = true
            this.addObj("player1", obj)
        }
        {
            let player = this._currentData.players.two
            const geo = new BoxGeometry(1, 0.3, 0.4)
            const mat = new MeshPhongMaterial({ color: player.color })
            const obj = new Mesh(geo, mat)
            obj.position.set(0, 0.3, -11.5)
            obj.castShadow = true
            this.addObj("player2", obj)
        }
        {
            const geo = new CylinderGeometry(1, 1, 0.3, 20)
            const mat = new MeshPhongMaterial({ color: 0xffffff })
            const obj = new Mesh(geo, mat)
            obj.position.set(0, 0.3, 0)
            obj.castShadow = true
            this.addObj("quoit", obj)
        }
    }

    initEngine() {
        console.log(`Three.js r${REVISION}`)

        this._engine.renderer.setPixelRatio(devicePixelRatio)
        this.resizeRenderer()
        this._engine.renderer.shadowMap.enabled = this._graphicConfig.shadows
        this._engine.renderer.shadowMap.type = PCFSoftShadowMap
        this._engine.renderer.outputEncoding = sRGBEncoding
        this._gameContainer.appendChild(this._engine.renderer.domElement)
        if (this._engine.stats) {
            this._engine.stats.showPanel(0)
            let dom = this._engine.stats.dom
            dom.style.position = "absolute"
            this._gameContainer.appendChild(dom)
        }
    }

    initKeyControl() {
        document.onkeydown = (e) => {
            this._keyPressed.set(e.code, true)
            switch (e.code) {
                case "Digit1":
                    this.playerScore(this._currentData.players.one)
                    break
                case "Digit2":
                    this.playerScore(this._currentData.players.two)
                    break

                default:
                    // console.log("keydown", e.code)
                    break
            }
        }
        document.onkeyup = (e) => {
            this._keyPressed.set(e.code, false)
        }
    }

    playerScore(winner: Player) {
        if (winner.name === this.currentPlayer()?.name)
            this.gameAlert(`<span style="color: green">You</span> have scored`)
        else
            this.gameAlert(
                `<span style="color: red">${winner.name}</span> has scored`
            )
    }

    gameAlert(text: string) {
        if (this._gameAlertTimeout) {
            {
                let e = document.getElementById("bigAlert")
                e?.classList.remove("bigAlertAnimation")
                if (e?.clientWidth) {
                }
            }
            clearTimeout(this._gameAlertTimeout)
            this._gameAlertTimeout = null
            this.gameAlert(text)
            return
        }
        document.getElementById("bigAlert")?.classList.add("bigAlertAnimation")
        if (document.querySelector("#bigAlert p"))
            document.querySelector("#bigAlert p")!.innerHTML = text
        this._gameAlertTimeout = setTimeout(() => {
            document
                .getElementById("bigAlert")
                ?.classList.remove("bigAlertAnimation")
            this._gameAlertTimeout = null
        }, 4000)
    }

    winningEvent(player: Player) {
        console.log(player)
        document
            .getElementById("endGameContainer")
            ?.classList.add("endGameBgTrigger")
        document.getElementById("endGame")?.classList.add("endGameCardTrigger")
        if (document.querySelector("#endGame #mainText"))
            document.querySelector(
                "#endGame #mainText"
            )!.innerHTML = `${player.name} win the game`
        if (document.querySelector("#endGame #score"))
            document.querySelector("#endGame #score")!.innerHTML = `${
                player.score
            } - ${
                player.id === 1
                    ? this._currentData.players.two.score
                    : this._currentData.players.one.score
            }`
    }

    updateHUD() {
        this._gameContainer.querySelector(
            "#gameHud .identity#one .name"
        )!.textContent =
            this._whoAmI === "one" ? "you" : this._currentData.players.one.name
        this._gameContainer.querySelector(
            "#gameHud .identity#one .score"
        )!.textContent = String(this._currentData.players.one.score)
        this._gameContainer.querySelector(
            "#gameHud .identity#two .name"
        )!.textContent =
            this._whoAmI === "two" ? "you" : this._currentData.players.two.name
        this._gameContainer.querySelector(
            "#gameHud .identity#two .score"
        )!.textContent = String(this._currentData.players.two.score)
    }

    socketEvents(event: string, data: any) {
        switch (event) {
            case "game:syncData":
                this._roundRunning = data.data.running
                if (data.force) {
                    console.log("forced update")
                    this._currentData = data.data
                    this.updateHUD()
                } else {
                    this._currentData.quoit.x = data.data.quoit.x
                    this._currentData.quoit.z = data.data.quoit.z
                    this._currentData.quoit.speed = data.data.quoit.speed

                    if (
                        this._whoAmI !== "one" ||
                        Math.abs(
                            data.data.players.one.x -
                                this._currentData.players.one.x
                        ) > 0.5
                    )
                        this._currentData.players.one.x = data.data.players.one.x
                    if (
                        this._whoAmI !== "two" ||
                        Math.abs(
                            data.data.players.two.x -
                                this._currentData.players.two.x
                        ) > 0.5
                    )
                        this._currentData.players.two.x = data.data.players.two.x
                }
                this.syncMeshs()
                break

            case "game:youAre":
                if (!this._whoAmI) {
                    this._whoAmI = data
                    if (data === "one")
                        this._engine.camera.position.set(0, 10, 25)
                    else if (data === "two")
                        this._engine.camera.position.set(0, 10, -25)
                    this._engine.camera.lookAt(0, 0, 0)
                    this.updateHUD()
                }
                break

            case "game:startRound":
                this._roundRunning = true
                break

            case "game:stopRound":
                this._roundRunning = false
                break

            case "game:kill":
                this.stopSimulation()
                break

            case "game:score":
                console.log(data)
                this.playerScore(data.player)
                break

            case "game:updateHUD":
                this.updateHUD()
                break

            case "game:win":
                this.winningEvent(data.player)
                break

            case "game:powerupCompare":
                let list = data.list as {
                    id: number
                    typeName: string
                    pos: {
                        x: number
                        z: number
                    }
                    sender: number | null
                    state: PowerUpStates
                    radius: number
                }[]

                if (
                    !compareArrays(list, getPowerUpInfos(this._engine.powerUp))
                ) {
                    list.forEach((e) => {
                        if (this._engine.powerUp.get(e.id) === undefined)
                            this._wsEmit("game:requestPowerup", { id: e.id })
                        else {
                            if (
                                e.sender !==
                                this._engine.powerUp.get(e.id)!._sender?.id
                            ) {
                                this._engine.powerUp.get(e.id)!._sender =
                                    e.sender
                                        ? e.sender! === 1
                                            ? this._currentData.players.one
                                            : this._currentData.players.two
                                        : null
                            }
                            if (
                                e.state !==
                                this._engine.powerUp.get(e.id)!._state
                            ) {
                                switch (e.state) {
                                    case PowerUpStates.IDLE:
                                        this._engine.powerUp.delete(e.id)
                                        this._wsEmit("game:requestPowerup", {
                                            id: e.id,
                                        })
                                        break
                                    case PowerUpStates.TRIGGERED:
                                        if (e.sender)
                                            this._engine.powerUp
                                                .get(e.id)!
                                                .trigger(
                                                    e.sender! === 1
                                                        ? this._currentData
                                                              .players.one
                                                        : this._currentData
                                                              .players.two
                                                )
                                        break
                                    case PowerUpStates.DESTROYED:
                                        this._engine.powerUp
                                            .get(e.id)!
                                            ._destroy()
                                        break

                                    default:
                                        break
                                }
                            }
                        }
                    })
                    const map = new Map(list.map((obj) => [obj.id, obj]))
                    this._engine.powerUp.forEach((e) => {
                        if (map.get(e._id) === undefined) {
                            e._destroy()
                            this._engine.powerUp.delete(e._id)
                        }
                    })
                }
                break

            case "game:powerupSync":
                const pu = data.pu as {
                    id: number
                    typeName: string
                    pos: {
                        x: number
                        z: number
                    }
                    sender: number | null
                    state: PowerUpStates
                    radius: number
                }
                if (
                    this._engine.powerUp.get(data.id as number) === undefined
                )
                    this._engine.powerUp.set(
                        data.id as number,
                        new PowerUp({
                            ctx: this._engine,
                            currentData: this._currentData,
                            id: pu.id,
                            type: PowerUpTypes[pu.typeName],
                            x: pu.pos.x,
                            z: pu.pos.z,
                            r: pu.radius,
                        })
                    )
                break

            case "game:powerupTrigger":
                {
                    let pu = this._engine.powerUp.get(data.id) as PowerUp
                    if (pu) pu.trigger(data.sender)
                }
                break

            case "game:powerupDestroy":
                {
                    let pu = this._engine.powerUp.get(data.id) as PowerUp
                    pu?._destroy()
                }
                break

            default:
                console.log("game socket event", event, data)
                break
        }
    }

    killEngine() {
        console.log("Three.js instance killed")
        this.stopSimulation()
        cancelAnimationFrame(this._engine.animationFrame)
        this._engine.objects.clear()
        this._gameContainer.querySelectorAll("canvas").forEach((canvas) => {
            canvas.parentElement?.removeChild(canvas)
        })
    }
}
