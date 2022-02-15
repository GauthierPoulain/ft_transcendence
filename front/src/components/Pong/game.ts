import * as THREE from "three"
import { degToRad } from "three/src/math/MathUtils"

function main() {
    var size = {
        x: document.getElementById("gameContainer")!.clientWidth,
        y: document.getElementById("gameContainer")!.clientHeight,
    }

    const graphicConfig = {
        shadows: true,
        renderResolution: 1,
    }

    window.onresize = () => {
        size.x = document.getElementById("gameContainer")!.clientWidth
        size.y = document.getElementById("gameContainer")!.clientHeight
        engine.renderer.setSize(
            size.x * graphicConfig.renderResolution,
            size.y * graphicConfig.renderResolution
        )
        engine.renderer.domElement.style.width = "100%"
        engine.renderer.domElement.style.height = "100%"
        engine.camera.aspect = size.x / size.y
        engine.camera.updateProjectionMatrix()
    }

    var keyPressed = new Map<string, boolean>()

    var engine = {
        scene: new THREE.Scene(),
        renderer: new THREE.WebGLRenderer({
            antialias: true,
        }),
        camera: new THREE.PerspectiveCamera(60, size.x / size.y, 0.1, 1000),
        objects: new Map<string, any>(),
        clock: new THREE.Clock(),
        animationFrame: 0,
    }

    var remoteData = {
        players: [
            { y: 0, height: 3 },
            { y: 0, height: 3 },
        ],
        ball: { x: 0, y: 0, radius: 0.3 },
    }

    class Player {
        name: string
        score: number = 0
        constructor(name: string) {
            this.name = name
        }
    }

    var playersData = new Array<Player>(2)

    function animate() {
        engine.animationFrame = requestAnimationFrame(animate)
        engine.renderer.render(engine.scene, engine.camera)
        let delta = engine.clock.getDelta()

        {
            if (keyPressed.get("ArrowUp") && !keyPressed.get("ArrowDown")) {
                let player = engine.objects.get("player0") as THREE.Mesh
                if (player.position.y + remoteData.players[0].height / 2 < 5)
                    player.position.y += 10 * delta
            }
            if (keyPressed.get("ArrowDown") && !keyPressed.get("ArrowUp")) {
                let player = engine.objects.get("player0") as THREE.Mesh
                if (player.position.y - remoteData.players[0].height / 2 > -5)
                    player.position.y -= 10 * delta
            }
            if (keyPressed.get("KeyA")) {
                let ball = engine.objects.get("ball") as THREE.Mesh
                ball.position.x -= 10 * delta
            }
            if (keyPressed.get("KeyD")) {
                let ball = engine.objects.get("ball") as THREE.Mesh
                ball.position.x += 10 * delta
            }
            if (keyPressed.get("KeyW")) {
                let ball = engine.objects.get("ball") as THREE.Mesh
                ball.position.y += 10 * delta
            }
            if (keyPressed.get("KeyS")) {
                let ball = engine.objects.get("ball") as THREE.Mesh
                ball.position.y -= 10 * delta
            }
        }
        {
            {
                let ball = engine.objects.get("ball") as THREE.Mesh
                let light = engine.objects.get("light") as THREE.PointLight

                light.position.set(
                    ball.position.x,
                    ball.position.y,
                    ball.position.z
                )
            }
        }
    }

    function initScene() {
        {
            const light = new THREE.PointLight(0xffffff, 0.25)
            light.position.set(0, 0, 0)
            light.castShadow = graphicConfig.shadows
            engine.objects.set("light", light)
            engine.scene.add(light)
        }
        {
            const light = new THREE.AmbientLight(0xffffff, 0.75)
            engine.objects.set("ambientLight", light)
            engine.scene.add(light)
        }
        {
            const geometry = new THREE.BoxGeometry(
                0.5,
                remoteData.players[0].height,
                0.5
            )
            const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
            const cube = new THREE.Mesh(geometry, material)
            cube.position.x = -7
            cube.castShadow = graphicConfig.shadows
            cube.receiveShadow = graphicConfig.shadows
            engine.objects.set("player0", cube)
            engine.scene.add(cube)
        }
        {
            const geometry = new THREE.BoxGeometry(
                0.5,
                remoteData.players[1].height,
                0.5
            )
            const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
            const cube = new THREE.Mesh(geometry, material)
            cube.castShadow = graphicConfig.shadows
            cube.receiveShadow = graphicConfig.shadows
            cube.position.x = 7
            engine.objects.set("player1", cube)
            engine.scene.add(cube)
        }
        {
            const geometry = new THREE.SphereGeometry(remoteData.ball.radius)
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
            const ball = new THREE.Mesh(geometry, material)
            // ball.castShadow = graphicConfig.shadows
            // ball.receiveShadow = graphicConfig.shadows
            engine.objects.set("ball", ball)
            engine.scene.add(ball)
        }
        {
            const geometry = new THREE.PlaneGeometry(10, 18)
            const material = new THREE.MeshStandardMaterial({ color: 0x222222 })
            const plane = new THREE.Mesh(geometry, material)
            plane.castShadow = graphicConfig.shadows
            plane.receiveShadow = graphicConfig.shadows
            plane.position.y = -5
            plane.rotation.x = -degToRad(90)
            engine.objects.set("floor", plane)
            plane.rotation.z = degToRad(90)
            engine.scene.add(plane)
        }
        {
            const geometry = new THREE.PlaneGeometry(10, 18)
            const material = new THREE.MeshStandardMaterial({ color: 0x222222 })
            const plane = new THREE.Mesh(geometry, material)
            plane.castShadow = graphicConfig.shadows
            plane.receiveShadow = graphicConfig.shadows
            plane.position.y = 5
            plane.rotation.x = degToRad(90)
            plane.rotation.z = degToRad(90)
            engine.objects.set("ceil", plane)
            engine.scene.add(plane)
        }
        {
            const geometry = new THREE.PlaneGeometry(10, 10)
            const material = new THREE.MeshStandardMaterial({ color: 0x222222 })
            const plane = new THREE.Mesh(geometry, material)
            plane.castShadow = graphicConfig.shadows
            plane.receiveShadow = graphicConfig.shadows
            plane.position.x = -9
            plane.rotation.y = degToRad(90)
            engine.objects.set("leftWall", plane)
            engine.scene.add(plane)
        }
        {
            const geometry = new THREE.PlaneGeometry(10, 10)
            const material = new THREE.MeshStandardMaterial({ color: 0x222222 })
            const plane = new THREE.Mesh(geometry, material)
            plane.castShadow = graphicConfig.shadows
            plane.receiveShadow = graphicConfig.shadows
            plane.position.x = 9
            plane.rotation.y = -degToRad(90)
            engine.objects.set("rightWall", plane)
            engine.scene.add(plane)
        }
        {
            const geometry = new THREE.PlaneGeometry(18, 10)
            const material = new THREE.MeshStandardMaterial({ color: 0x222222 })
            const plane = new THREE.Mesh(geometry, material)
            plane.castShadow = graphicConfig.shadows
            plane.receiveShadow = graphicConfig.shadows
            plane.position.z = -5
            engine.objects.set("backWall", plane)
            engine.scene.add(plane)
        }
    }

    function initEngine() {
        engine.renderer.setSize(
            size.x * graphicConfig.renderResolution,
            size.y * graphicConfig.renderResolution
        )
        engine.renderer.domElement.style.width = "100%"
        engine.renderer.domElement.style.height = "100%"
        engine.renderer.shadowMap.enabled = graphicConfig.shadows
        engine.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        engine.camera.position.z = 12
        // engine.camera.position.x = -8
        document
            .querySelector("#gameContainer canvas")
            ?.replaceWith(engine.renderer.domElement)
    }

    function updateHUD() {
        document.querySelector(".identity#one .name")!.textContent =
            playersData[0].name
        document.querySelector(".identity#one .score")!.textContent = String(
            playersData[0].score
        )
        document.querySelector(".identity#two .name")!.textContent =
            playersData[1].name
        document.querySelector(".identity#two .score")!.textContent = String(
            playersData[1].score
        )
    }

    function initGameData() {
        playersData[0] = new Player("GogoLeDozo")
        playersData[1] = new Player("HornyBoiii")
    }

    function initKeyControl() {
        document.onkeydown = (e) => {
            keyPressed.set(e.code, true)
            switch (e.code) {
                case "Digit1":
                    playersData[0].score += 1
                    updateHUD()
                    break
                case "Digit2":
                    playersData[1].score += 1
                    updateHUD()
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

    initGameData()
    updateHUD()
    initEngine()
    initScene()
    initKeyControl()

    document.addEventListener(
        "stopRendering",
        () => {
            console.log("stop render")
            cancelAnimationFrame(engine.animationFrame)
        },
        { once: true }
    )

    console.log("game loaded")
    animate()
}

export default function game() {
    if (document.getElementById("gameContainer")) main()
}
