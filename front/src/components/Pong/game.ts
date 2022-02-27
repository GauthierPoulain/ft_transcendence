import * as THREE from "three"
import Stats from "stats.js"

class Player {
    name: string
    score: number = 0
    x: number = 0
    width: number = 3
    color: number = 0xffffff
    meshName: string
    last: number

    constructor(name: string, color: number, meshName: string) {
        this.name = name
        this.color = color
        this.meshName = meshName
        this.last = Date.now()
    }
}

function hexToRgb(hex: number) {
    return {
        r: hex >> 16,
        g: (hex >> 8) & 255,
        b: hex & 255,
    }
}

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

export default class Game {
    _size: { x: number; y: number }
    _gameContainer: HTMLObjectElement

    _lastTime: number

    _wsEmit: (event: string, data: any) => void

    _wsReady = false
    _engineReady = false

    _engine: {
        scene: THREE.Scene
        renderer: THREE.WebGLRenderer
        camera: THREE.PerspectiveCamera
        objects: Map<string, any>
        clock: THREE.Clock
        animationFrame: number
        animationActions: Map<string, THREE.AnimationAction>
        stats: Stats | null
    }

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
            speed: { x: number; xM: number; z: number }
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

        this._lastTime = Date.now()

        this._engine = {
            scene: new THREE.Scene(),
            renderer: new THREE.WebGLRenderer({
                antialias: this._graphicConfig.antiAliasing,
                powerPreference: "high-performance",
            }),
            camera: new THREE.PerspectiveCamera(
                50,
                this._size.x / this._size.y,
                0.1,
                40
            ),
            objects: new Map<string, any>(),
            clock: new THREE.Clock(),
            animationFrame: 0,
            animationActions: new Map<string, THREE.AnimationAction>(),
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
                one: new Player("pl1", 0xffffff, "player1"),
                two: new Player("pl2", 0xffffff, "player2"),
            },
            quoit: {
                x: 0,
                z: 0,
                radius: 0.5,
                color: 0xffffff,
                speed: { x: 0, xM: 3, z: 10 },
            },
        }

        this.initEngine()
        this.initScene()
        this.syncSimulation()
        this.updateHUD()
        this.registerAnimations()
        this.initKeyControl()
        this.animate()

        this.startSimulation()

        this.setReady({ engine: true })
    }

    setReady({ engine, ws }: { engine?: boolean; ws?: boolean }) {
        if (engine != undefined) this._engineReady = engine
        if (ws != undefined) this._wsReady = ws
        if (this._engineReady && this._wsReady) {
            this._wsEmit("game.ready", null)
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
        if (this._whoAmI == "one" || this._whoAmI == "two")
            return this._currentData.players[this._whoAmI]
        return null
    }

    syncMeshs() {
        const quoit = this._engine.objects.get("quoit") as THREE.Mesh
        const playerP = this._engine.objects.get("player1") as THREE.Mesh
        const playerN = this._engine.objects.get("player2") as THREE.Mesh

        quoit.position.x = this._currentData.quoit.x
        quoit.position.z = this._currentData.quoit.z
        quoit.scale.x = this._currentData.quoit.radius
        quoit.scale.z = this._currentData.quoit.radius

        playerP.position.x = this._currentData.players.one.x
        playerP.scale.x = this._currentData.players.one.width

        playerN.position.x = this._currentData.players.two.x
        playerN.scale.x = this._currentData.players.two.width
    }

    syncSimulation() {
        this.syncMeshs()
    }

    startSimulation() {
        this._simData.last = Date.now()
        this._simData.running = true
        this._simData.interval = setInterval(() => {
            this.localSimulation()
        }, 1)
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
            const quoit = this._engine.objects.get("quoit") as THREE.Mesh
            const wallP = this._engine.objects.get("map_border1") as THREE.Mesh
            const wallN = this._engine.objects.get("map_border2") as THREE.Mesh
            const playerP = this._engine.objects.get("player1") as THREE.Mesh
            const playerN = this._engine.objects.get("player2") as THREE.Mesh

            if (this._whoAmI == "one" || this._whoAmI == "two") {
                const player = this._engine.objects.get(
                    this._currentData.players[this._whoAmI!].meshName
                ) as THREE.Mesh

                if (
                    this._keyPressed.get("ArrowLeft") &&
                    !this._keyPressed.get("ArrowRight")
                ) {
                    if (
                        !collisionBoxBox(
                            player,
                            this._whoAmI == "one" ? wallN : wallP
                        )
                    ) {
                        let tmpX = (this._currentData.players[
                            this._whoAmI!
                        ].x += (this._whoAmI == "one" ? -10 : 10) * delta)
                        this._wsEmit("game.playerMove", {
                            x: tmpX,
                            time: Date.now(),
                        })
                    }
                }
                if (
                    this._keyPressed.get("ArrowRight") &&
                    !this._keyPressed.get("ArrowLeft")
                ) {
                    if (
                        !collisionBoxBox(
                            player,
                            this._whoAmI == "one" ? wallP : wallN
                        )
                    ) {
                        let tmpX = (this._currentData.players[
                            this._whoAmI!
                        ].x += (this._whoAmI == "one" ? 10 : -10) * delta)
                        this._wsEmit("game.playerMove", {
                            x: tmpX,
                            time: Date.now(),
                        })
                    }
                }
            }
            {
                if (
                    collisionBoxCyl(
                        playerP,
                        quoit,
                        this._currentData.quoit.radius
                    )
                ) {
                    this._currentData.quoit.speed.z = -Math.abs(
                        this._currentData.quoit.speed.z
                    )
                    let xSpeed = -(
                        this._currentData.players.one.x -
                        this._currentData.quoit.x
                    )
                    this._currentData.quoit.speed.x +=
                        xSpeed * this._currentData.quoit.speed.xM
                } else if (
                    collisionBoxCyl(
                        playerN,
                        quoit,
                        this._currentData.quoit.radius
                    )
                ) {
                    this._currentData.quoit.speed.z = Math.abs(
                        this._currentData.quoit.speed.z
                    )
                    let xSpeed = -(
                        this._currentData.players.two.x -
                        this._currentData.quoit.x
                    )
                    this._currentData.quoit.speed.x +=
                        xSpeed * this._currentData.quoit.speed.xM
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

            this._simData.last = Date.now()
        } catch (error) {
            console.log(error)
            this.stopSimulation()
            return false
        }
    }

    render(delta: number) {
        this._engine.animationActions.forEach((action) => {
            action.getMixer().update(delta)
        })
    }

    animate() {
        this._engine.stats?.begin()
        this.render(this._engine.clock.getDelta())
        this._engine.renderer.render(this._engine.scene, this._engine.camera)
        this._engine.stats?.end()
        this._engine.animationFrame = requestAnimationFrame(
            this.animate.bind(this)
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
            const light = new THREE.AmbientLight(0xffffff, 0.3)
            this.addObj("ambientLight", light)
        }
        {
            const light = new THREE.PointLight(0xffffff, 1, 40)
            light.position.set(12, 6, 0)
            light.castShadow = this._graphicConfig.shadows
            this.addObj("light", light)
        }
        {
            const geo = new THREE.BoxGeometry(
                this._map.width,
                this._map.height,
                this._map.depth / 2 - this._map.separator.depth / 2
            )
            const mat = new THREE.MeshPhongMaterial({ color: this._map.color })
            const obj = new THREE.Mesh(geo, mat)
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
            const geo = new THREE.BoxGeometry(
                this._map.width,
                this._map.height,
                this._map.depth / 2 - this._map.separator.depth / 2
            )
            const mat = new THREE.MeshPhongMaterial({ color: this._map.color })
            const obj = new THREE.Mesh(geo, mat)
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
            const geo = new THREE.BoxGeometry(
                this._map.width,
                this._map.height,
                this._map.separator.depth
            )
            const mat = new THREE.MeshPhongMaterial({
                color: this._map.separator.color,
            })
            const obj = new THREE.Mesh(geo, mat)
            obj.position.set(0, -(this._map.height / 2), 0)
            obj.receiveShadow = true
            this.addObj("map_separator", obj)
        }
        {
            const geo = new THREE.BoxGeometry(
                this._map.borders.width,
                this._map.borders.height,
                this._map.depth
            )
            const mat = new THREE.MeshPhongMaterial({
                color: this._map.borders.color,
            })
            const obj = new THREE.Mesh(geo, mat)
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
            const geo = new THREE.BoxGeometry(
                this._map.borders.width,
                this._map.borders.height,
                this._map.depth
            )
            const mat = new THREE.MeshPhongMaterial({
                color: this._map.borders.color,
            })
            const obj = new THREE.Mesh(geo, mat)
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
            const geo = new THREE.BoxGeometry(1, 0.3, 0.4)
            const mat = new THREE.MeshPhongMaterial({ color: player.color })
            const obj = new THREE.Mesh(geo, mat)
            obj.position.set(0, 0.3, 11.5)
            obj.castShadow = true
            this.addObj("player1", obj)
        }
        {
            let player = this._currentData.players.two
            const geo = new THREE.BoxGeometry(1, 0.3, 0.4)
            const mat = new THREE.MeshPhongMaterial({ color: player.color })
            const obj = new THREE.Mesh(geo, mat)
            obj.position.set(0, 0.3, -11.5)
            obj.castShadow = true
            this.addObj("player2", obj)
        }
        {
            const geo = new THREE.CylinderGeometry(1, 1, 0.3, 20)
            const mat = new THREE.MeshPhongMaterial({ color: 0xffffff })
            const obj = new THREE.Mesh(geo, mat)
            obj.position.set(0, 0.3, 0)
            obj.castShadow = true
            this.addObj("quoit", obj)
        }
    }

    registerAnimations() {
        {
            let obj = this._engine.objects.get(
                "mapPannel_player1"
            ) as THREE.Mesh
            let mat = obj.material as THREE.MeshPhongMaterial
            let blinkColor = hexToRgb(0xff0000)
            let colorsKF = new THREE.ColorKeyframeTrack(
                ".material.color",
                [0, 1],
                [
                    blinkColor.r,
                    blinkColor.g,
                    blinkColor.b,
                    mat.color.r,
                    mat.color.g,
                    mat.color.b,
                ],
                THREE.InterpolateDiscrete
            )
            const clip = new THREE.AnimationClip("blink", 2, [colorsKF])
            const mixer = new THREE.AnimationMixer(obj)
            const clipAction = mixer.clipAction(clip)
            clipAction.setLoop(THREE.LoopRepeat, 4)
            clipAction.timeScale = 3
            this._engine.animationActions.set(
                "mapPannel_player1:blink",
                clipAction
            )
        }
        {
            let obj = this._engine.objects.get(
                "mapPannel_player2"
            ) as THREE.Mesh
            let mat = obj.material as THREE.MeshPhongMaterial
            let blinkColor = hexToRgb(0xff0000)
            let colorsKF = new THREE.ColorKeyframeTrack(
                ".material.color",
                [0, 1],
                [
                    blinkColor.r,
                    blinkColor.g,
                    blinkColor.b,
                    mat.color.r,
                    mat.color.g,
                    mat.color.b,
                ],
                THREE.InterpolateDiscrete
            )
            const clip = new THREE.AnimationClip("blink", 2, [colorsKF])
            const mixer = new THREE.AnimationMixer(obj)
            const clipAction = mixer.clipAction(clip)
            clipAction.setLoop(THREE.LoopRepeat, 4)
            clipAction.timeScale = 3
            this._engine.animationActions.set(
                "mapPannel_player2:blink",
                clipAction
            )
        }
    }

    initEngine() {
        console.log(`Three.js r${THREE.REVISION}`)

        this._engine.renderer.setPixelRatio(devicePixelRatio)
        this.resizeRenderer()
        this._engine.renderer.shadowMap.enabled = this._graphicConfig.shadows
        this._engine.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this._engine.renderer.outputEncoding = THREE.sRGBEncoding
        {
            this._gameContainer.appendChild(this._engine.renderer.domElement)
            if (this._engine.stats) {
                this._engine.stats.showPanel(0)
                let dom = this._engine.stats.dom
                dom.style.position = "absolute"
                this._gameContainer.appendChild(dom)
            }
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
                case "Digit3":
                    this.startSimulation()
                    break
                case "Digit4":
                    this.stopSimulation()
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
        this.stopSimulation()
        var looser =
            winner == this._currentData.players.one
                ? this._currentData.players.two
                : this._currentData.players.one
        const clip = this._engine.animationActions.get(
            "mapPannel_" + looser.meshName + ":blink"
        )
        clip?.reset()
        clip?.play()
        this.gameAlert(
            winner.name == this.currentPlayer()?.name
                ? "You have scored"
                : winner.name + " has scored"
        )
        winner.score++
        this.updateHUD()
        setTimeout(() => {
            this.startSimulation()
        }, 3000)
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

    updateHUD() {
        this._gameContainer.querySelector(
            "#gameHud .identity#one .name"
        )!.textContent = this._currentData.players.one.name
        this._gameContainer.querySelector(
            "#gameHud .identity#one .score"
        )!.textContent = String(this._currentData.players.one.score)
        this._gameContainer.querySelector(
            "#gameHud .identity#two .name"
        )!.textContent = this._currentData.players.two.name
        this._gameContainer.querySelector(
            "#gameHud .identity#two .score"
        )!.textContent = String(this._currentData.players.two.score)
    }

    socketEvents(event: string, data: any) {
        switch (event) {
            case "game.syncData":
                if (this._lastTime < data.time) {
                    if (data.force) {
                        this._currentData = data.data
                    } else {
                        this._currentData.quoit = data.data.quoit
                        if (
                            this._whoAmI != "one" ||
                            Math.abs(
                                data.data.players.one.x -
                                    this._currentData.players.one.x
                            ) > 0.5
                        )
                            this._currentData.players.one =
                                data.data.players.one
                        if (
                            this._whoAmI != "two" ||
                            Math.abs(
                                data.data.players.two.x -
                                    this._currentData.players.two.x
                            ) > 0.5
                        )
                            this._currentData.players.two =
                                data.data.players.two
                    }
                    this.syncMeshs()
                    this._lastTime = data.time
                }
                break

            case "game.youAre":
                this._whoAmI = data
                if (data == "one") this._engine.camera.position.set(0, 10, 25)
                else if (data == "two")
                    this._engine.camera.position.set(0, 10, -25)
                this._engine.camera.lookAt(0, 0, 0)
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
        this._engine.animationActions.clear()
        this._gameContainer.querySelectorAll("canvas").forEach((canvas) => {
            canvas.parentElement?.removeChild(canvas)
        })
    }
}
