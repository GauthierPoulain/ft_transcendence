import * as THREE from "three"
import Stats from "stats.js"
import WebSocketService from "../../WebSocketService"

function hexToRgb(hex: number) {
    return {
        r: hex >> 16,
        g: (hex >> 8) & 255,
        b: hex & 255,
    }
}

function main() {
    var size = {
        x: document.getElementById("gameContainer")!.clientWidth,
        y: document.getElementById("gameContainer")!.clientHeight,
    }

    const graphicConfig = {
        antiAliasing: true,
        shadows: true,
        renderResolution: 1,
        performanceMonitor: true,
    }

    const map = {
        depth: 25,
        width: 15,
        height: 0.5,
        color: 0x0000ff,
        separator: {
            depth: 0.5,
            color: 0xffffff,
        },
        borders: {
            width: 0.3,
            height: 1.25,
            color: 0xffffff,
        },
    }

    function resizeRenderer() {
        size.x = document.getElementById("gameContainer")!.clientWidth
        size.y = document.getElementById("gameContainer")!.clientHeight
        engine.renderer.setSize(
            size.x * graphicConfig.renderResolution,
            size.y * graphicConfig.renderResolution
        )
        engine.renderer.domElement.style.width = "100%"
        engine.renderer.domElement.style.height =
            "calc(100vh - " +
            document.getElementById("navbar")?.offsetHeight +
            "px)"
        engine.camera.aspect = size.x / size.y
        engine.camera.updateProjectionMatrix()
    }

    window.onresize = resizeRenderer

    var keyPressed = new Map<string, boolean>()

    var engine = {
        scene: new THREE.Scene(),
        renderer: new THREE.WebGLRenderer({
            antialias: graphicConfig.antiAliasing,
            powerPreference: "high-performance",
        }),
        camera: new THREE.PerspectiveCamera(50, size.x / size.y, 0.1, 1000),
        objects: new Map<string, any>(),
        clock: new THREE.Clock(),
        animationFrame: 0,
        animationClips: new Map<string, THREE.AnimationAction>(),
        stats: graphicConfig.performanceMonitor ? new Stats() : null,
    }

    class Player {
        name: string
        score: number = 0
        x: number = 0
        width: number = 3
        color: number = 0xffffff
        meshName: string

        constructor(name: string, color: number, meshName: string) {
            this.name = name
            this.color = color
            this.meshName = meshName
        }
    }

    var simulationData: {
        running: boolean
        last: number
        interval: any
    } = {
        running: true,
        last: Date.now(),
        interval: undefined,
    }

    function initGameData() {
        return {
            players: {
                one: new Player("Player 1", 0xffffff, "player1"),
                two: new Player("Player 2", 0xffffff, "player2"),
            },
            ball: {
                x: 0,
                y: 0,
                radius: 0.5,
                color: 0xffffff,
                speed: { x: 0, z: 10 },
            },
        }
    }

    var currentGameData = initGameData()

    function whoAmI() {
        return "one"
        // return "two"
        // return "spec"
    }

    function currentPlayer(): Player {
        return currentGameData.players[whoAmI()]
    }

    function collisionBoxCyl(box: THREE.Mesh, cyl: THREE.Mesh) {
        box.geometry.computeBoundingBox()
        box.updateMatrixWorld()
        const Cbox = box.geometry.boundingBox?.clone()
        Cbox?.applyMatrix4(box.matrixWorld)
        const Csphere = new THREE.Sphere(
            cyl.position,
            currentGameData.ball.radius
        )
        return Cbox?.intersectsSphere(Csphere)
    }

    function localSimulation() {
        try {
            const delta = (Date.now() - simulationData.last) / 1000

            if (!simulationData.running) return
            const quoit = engine.objects.get("quoit") as THREE.Mesh
            const wallP = engine.objects.get("map_border1") as THREE.Mesh
            const wallN = engine.objects.get("map_border2") as THREE.Mesh
            const playerP = engine.objects.get("player1") as THREE.Mesh
            const playerN = engine.objects.get("player2") as THREE.Mesh

            {
                if (collisionBoxCyl(playerP, quoit)) {
                    currentGameData.ball.speed.z = -Math.abs(
                        currentGameData.ball.speed.z
                    )
                } else if (collisionBoxCyl(playerN, quoit)) {
                    currentGameData.ball.speed.z = Math.abs(
                        currentGameData.ball.speed.z
                    )
                }
            }
            {
                quoit.position.x += currentGameData.ball.speed.x * delta
                quoit.position.z += currentGameData.ball.speed.z * delta
            }

            simulationData.last = Date.now()
        } catch (error) {
            console.log(error)
            simulationData.running = false
            return false
        }
    }

    function render(delta) {
        engine.animationClips.forEach((clip) => {
            clip.getMixer().update(delta)
        })
        {
            if (keyPressed.get("ArrowLeft") && !keyPressed.get("ArrowRight")) {
                let player = engine.objects.get("player1") as THREE.Mesh
                if (
                    player.position.x - currentPlayer().width / 2 >
                    -map.width / 2
                )
                    player.position.x -= 10 * delta
            }
            if (keyPressed.get("ArrowRight") && !keyPressed.get("ArrowLeft")) {
                let player = engine.objects.get("player1") as THREE.Mesh
                if (
                    player.position.x + currentPlayer().width / 2 <
                    map.width / 2
                )
                    player.position.x += 10 * delta
            }
            // if (keyPressed.get("KeyA")) {
            //     let quoit = engine.objects.get("quoit") as THREE.Mesh
            //     quoit.position.x -=
            //         (keyPressed.get("ShiftLeft") == true ? 10 : 1) * delta
            // }
            // if (keyPressed.get("KeyD")) {
            //     let quoit = engine.objects.get("quoit") as THREE.Mesh
            //     quoit.position.x +=
            //         (keyPressed.get("ShiftLeft") == true ? 10 : 1) * delta
            // }
            // if (keyPressed.get("KeyW")) {
            //     let quoit = engine.objects.get("quoit") as THREE.Mesh
            //     quoit.position.z -=
            //         (keyPressed.get("ShiftLeft") == true ? 10 : 1) * delta
            // }
            // if (keyPressed.get("KeyS")) {
            //     let quoit = engine.objects.get("quoit") as THREE.Mesh
            //     quoit.position.z +=
            //         (keyPressed.get("ShiftLeft") == true ? 10 : 1) * delta
            // }
        }
    }

    function animate() {
        engine.stats?.begin()
        render(engine.clock.getDelta())
        engine.renderer.render(engine.scene, engine.camera)
        engine.stats?.end()
        engine.animationFrame = requestAnimationFrame(animate)
    }

    function initScene() {
        engine.camera.position.set(0, 10, 25)
        engine.camera.lookAt(0, 0, 0)

        function addObj(name: string, obj: any) {
            engine.objects.set(name, obj)
            engine.scene.add(obj)
        }
        {
            const light = new THREE.AmbientLight(0xffffff, 0.3)
            addObj("ambientLight", light)
        }
        {
            const light = new THREE.PointLight(0xffffff, 1, 40)
            light.position.set(12, 6, 0)
            light.castShadow = graphicConfig.shadows
            addObj("light", light)
        }

        {
            const geo = new THREE.BoxGeometry(
                map.width,
                map.height,
                map.depth / 2 - map.separator.depth / 2
            )
            const mat = new THREE.MeshPhongMaterial({ color: map.color })
            const obj = new THREE.Mesh(geo, mat)
            obj.position.set(
                0,
                -(map.height / 2),
                (map.depth - map.separator.depth) / 4 + map.separator.depth / 2
            )
            obj.receiveShadow = true
            addObj("mapPannel_player1", obj)
        }
        {
            const geo = new THREE.BoxGeometry(
                map.width,
                map.height,
                map.depth / 2 - map.separator.depth / 2
            )
            const mat = new THREE.MeshPhongMaterial({ color: map.color })
            const obj = new THREE.Mesh(geo, mat)
            obj.position.set(
                0,
                -(map.height / 2),
                -(
                    (map.depth - map.separator.depth) / 4 +
                    map.separator.depth / 2
                )
            )
            obj.receiveShadow = true
            addObj("mapPannel_player2", obj)
        }
        {
            const geo = new THREE.BoxGeometry(
                map.width,
                map.height,
                map.separator.depth
            )
            const mat = new THREE.MeshPhongMaterial({
                color: map.separator.color,
            })
            const obj = new THREE.Mesh(geo, mat)
            obj.position.set(0, -(map.height / 2), 0)
            obj.receiveShadow = true
            addObj("map_separator", obj)
        }
        {
            const geo = new THREE.BoxGeometry(
                map.borders.width,
                map.borders.height,
                map.depth
            )
            const mat = new THREE.MeshPhongMaterial({
                color: map.borders.color,
            })
            const obj = new THREE.Mesh(geo, mat)
            obj.position.set(
                map.width / 2 + map.borders.width / 2,
                map.borders.height / 2 - map.height,
                0
            )
            obj.castShadow = true
            obj.receiveShadow = true
            addObj("map_border1", obj)
        }
        {
            const geo = new THREE.BoxGeometry(
                map.borders.width,
                map.borders.height,
                map.depth
            )
            const mat = new THREE.MeshPhongMaterial({
                color: map.borders.color,
            })
            const obj = new THREE.Mesh(geo, mat)
            obj.position.set(
                -(map.width / 2 + map.borders.width / 2),
                map.borders.height / 2 - map.height,
                0
            )
            obj.castShadow = true
            obj.receiveShadow = true
            addObj("map_border2", obj)
        }
        {
            let player = currentGameData.players.one
            const geo = new THREE.BoxGeometry(player.width, 0.3, 0.4)
            const mat = new THREE.MeshPhongMaterial({ color: player.color })
            const obj = new THREE.Mesh(geo, mat)
            obj.position.set(0, 0.3, 11.5)
            obj.castShadow = true
            addObj("player1", obj)
        }
        {
            let player = currentGameData.players.two
            const geo = new THREE.BoxGeometry(player.width, 0.3, 0.4)
            const mat = new THREE.MeshPhongMaterial({ color: player.color })
            const obj = new THREE.Mesh(geo, mat)
            obj.position.set(0, 0.3, -11.5)
            obj.castShadow = true
            addObj("player2", obj)
        }
        {
            const geo = new THREE.CylinderGeometry(
                currentGameData.ball.radius,
                currentGameData.ball.radius,
                0.3,
                20
            )
            const mat = new THREE.MeshPhongMaterial({ color: 0xffffff })
            const obj = new THREE.Mesh(geo, mat)
            obj.position.set(0, 0.3, 0)
            obj.castShadow = true
            addObj("quoit", obj)
        }
    }

    function initEngine() {
        console.log(`Three.js r${THREE.REVISION}`)

        engine.renderer.setSize(
            size.x * graphicConfig.renderResolution,
            size.y * graphicConfig.renderResolution
        )
        engine.renderer.setPixelRatio(2)
        engine.renderer.domElement.style.width = "100%"
        engine.renderer.domElement.style.height = "100%"
        engine.renderer.shadowMap.enabled = graphicConfig.shadows
        engine.renderer.shadowMap.type = THREE.PCFShadowMap
        engine.renderer.outputEncoding = THREE.sRGBEncoding
        {
            const list = document.querySelectorAll("#gameContainer canvas")
            list.forEach((e) => {
                e.parentElement?.removeChild(e)
            })
        }
        document
            .querySelector("#gameContainer")
            ?.appendChild(engine.renderer.domElement)

        if (engine.stats) {
            engine.stats.showPanel(0)
            let dom = engine.stats.dom
            dom.style.position = "absolute"
            document.querySelector("#gameContainer")?.appendChild(dom)
        }
    }

    function updateHUD() {
        document.querySelector(".identity#one .name")!.textContent =
            currentGameData.players.one.name
        document.querySelector(".identity#one .score")!.textContent = String(
            currentGameData.players.one.score
        )
        document.querySelector(".identity#two .name")!.textContent =
            currentGameData.players.two.name
        document.querySelector(".identity#two .score")!.textContent = String(
            currentGameData.players.two.score
        )
    }

    function initKeyControl() {
        document.onkeydown = (e) => {
            keyPressed.set(e.code, true)
            switch (e.code) {
                case "Digit1":
                    playerScore(
                        currentGameData.players.one,
                        currentGameData.players.two
                    )
                    break
                case "Digit2":
                    playerScore(
                        currentGameData.players.two,
                        currentGameData.players.one
                    )
                    break
                case "Digit3":
                    simulationData.running = !simulationData.running
                    break

                default:
                    // console.log("keydown", e.code)
                    break
            }
        }
        document.onkeyup = (e) => {
            switch (e.code) {
                default:
                    // console.log("keyup", e.code)
                    break
            }
            keyPressed.set(e.code, false)
        }
    }

    document.addEventListener(
        "stopRendering",
        () => {
            console.log("stop render")
            simulationData.running = false
            clearInterval(simulationData.interval)
            cancelAnimationFrame(engine.animationFrame)
        },
        { once: true }
    )

    {
        document.getElementById("loadingContainer")!.style.display = "none"
        document.getElementById("gameContainer")!.style.display = "block"
        resizeRenderer()
        console.log("game loaded")
    }

    function registerAnimations() {
        {
            let obj = engine.objects.get("mapPannel_player1") as THREE.Mesh
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
            engine.animationClips.set("mapPannel_player1:blink", clipAction)
        }
        {
            let obj = engine.objects.get("mapPannel_player2") as THREE.Mesh
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
            engine.animationClips.set("mapPannel_player2:blink", clipAction)
        }
    }

    function playerScore(scorer: Player, looser: Player) {
        if (looser.meshName == "player1") {
            const clip = engine.animationClips.get("mapPannel_player1:blink")
            clip?.reset()
            clip?.play()
        } else if (looser.meshName == "player2") {
            const clip = engine.animationClips.get("mapPannel_player2:blink")
            clip?.reset()
            clip?.play()
        }
        gameAlert(
            scorer.name == currentPlayer().name
                ? "You have scored"
                : scorer.name + " has scored"
        )
        scorer.score++
        updateHUD()
    }

    let gameAlertTimeout: any | null = null
    function gameAlert(text: string) {
        if (gameAlertTimeout) {
            document
                .getElementById("bigAlert")
                ?.classList.remove("bigAlertAnimation")
            clearTimeout(gameAlertTimeout)
            gameAlertTimeout = null
            setTimeout(() => {
                gameAlert(text)
            }, 1)
            return
        }
        document.getElementById("bigAlert")?.classList.add("bigAlertAnimation")
        if (document.querySelector("#bigAlert p"))
            document.querySelector("#bigAlert p")!.innerHTML = text
        gameAlertTimeout = setTimeout(() => {
            document
                .getElementById("bigAlert")
                ?.classList.remove("bigAlertAnimation")
            gameAlertTimeout = null
        }, 4000)
    }

    initGameData()
    initEngine()
    initScene()
    updateHUD()
    registerAnimations()
    initKeyControl()
    animate()
    simulationData.interval = setInterval(() => {
        localSimulation()
    }, 1)
}

export default function game(ws: WebSocketService) {
    ws.onOpen(() => {
        console.log("ws connected")
        // ws.emit("login")
        main()
    })
}
