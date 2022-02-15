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

    var engine = {
        scene: new THREE.Scene(),
        renderer: new THREE.WebGLRenderer({
            antialias: true,
        }),
        camera: new THREE.PerspectiveCamera(60, size.x / size.y, 0.1, 1000),
        objects: new Map<string, any>(),
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

    initGameData()
    updateHUD()
    initEngine()
    initScene()
    animate()
}
