import * as THREE from "three"

export default function game() {
    var size = {
        x: document.getElementById("gameContainer")!.clientWidth,
        y: document.getElementById("gameContainer")!.clientHeight,
    }

    window.addEventListener("resize", (e) => {
        size.x = document.getElementById("gameContainer")!.clientWidth
        size.y = document.getElementById("gameContainer")!.clientHeight
        engine.renderer.setSize(size.x, size.y)
        engine.camera.aspect = size.x / size.y
        engine.camera.updateProjectionMatrix()
    })

    var keyPressed = new Map<string, boolean>()

    var engine = {
        scene: new THREE.Scene(),
        renderer: new THREE.WebGLRenderer({
            antialias: true,
        }),
        camera: new THREE.PerspectiveCamera(60, size.x / size.y, 0.1, 1000),
        objects: new Map<string, any>(),
        clock: new THREE.Clock(),
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
        requestAnimationFrame(animate)
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
        }
    }

    function initScene() {
        {
            const geometry = new THREE.BoxGeometry(
                0.5,
                remoteData.players[0].height,
                0.5
            )
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
            const cube = new THREE.Mesh(geometry, material)
            cube.position.x = -7
            engine.objects.set("player0", cube)
            engine.scene.add(cube)
        }
        {
            const geometry = new THREE.BoxGeometry(
                0.5,
                remoteData.players[1].height,
                0.5
            )
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
            const cube = new THREE.Mesh(geometry, material)
            cube.position.x = 7
            engine.objects.set("player1", cube)
            engine.scene.add(cube)
        }
        {
            const geometry = new THREE.SphereGeometry(remoteData.ball.radius)
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
            const ball = new THREE.Mesh(geometry, material)
            engine.objects.set("ball", ball)
            engine.scene.add(ball)
        }
    }

    function initEngine() {
        engine.renderer.setSize(size.x, size.y)
        engine.camera.position.z = 12
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
                case "ArrowUp":
                    break
                case "ArrowDown":
                    break
                case "Digit1":
                    playersData[0].score += 1
                    updateHUD()
                    break
                case "Digit2":
                    playersData[1].score += 1
                    updateHUD()
                    break

                default:
                    console.log("keydown", e.code)
                    break
            }
        }
        document.onkeyup = (e) => {
            switch (e.code) {
                case "ArrowUp":
                    break
                case "ArrowDown":
                    break

                default:
                    console.log("keyup", e.code)

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
    console.log("game loaded")

    animate()
}
