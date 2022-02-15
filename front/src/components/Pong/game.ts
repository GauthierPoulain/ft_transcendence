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
            alpha: false,
            preserveDrawingBuffer: true,
        }),
        camera: new THREE.PerspectiveCamera(60, size.x / size.y, 0.1, 1000),
        objects: new Map<string, any>(),
        hud: {
            cam: new THREE.OrthographicCamera(
                -size.x / 2,
                size.x / 2,
                size.y / 2,
                -size.y / 2
            ),
            canvas: document.createElement("canvas"),
            scene: new THREE.Scene(),
            texture: new THREE.Texture(),
            material: new THREE.MeshBasicMaterial(),
            geometry: new THREE.PlaneGeometry(size.x, size.y),
            plane: new THREE.Mesh(),
        },
    }
    engine.renderer.autoClear = true

    engine.hud.canvas.width = size.x
    engine.hud.canvas.height = size.y

    var hudBitmap = engine.hud.canvas.getContext("2d")
    if (hudBitmap) {
        hudBitmap.font = "Normal 40px Arial"
        hudBitmap.textAlign = "center"
        hudBitmap.fillStyle = "rgba(245,245,245,0.75)"
        hudBitmap.fillText("Initializing...", size.x / 2, size.y / 2)
    }

    engine.hud.texture.image = engine.hud.canvas
    engine.hud.texture.needsUpdate = true
    engine.hud.material.map = engine.hud.texture
    engine.hud.plane.geometry = engine.hud.geometry
    engine.hud.plane.material = engine.hud.material
    engine.hud.material.transparent = true
    engine.hud.scene.add(engine.hud.plane)

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

    var playersData: Array<Player> | null = null

    function animate() {
        requestAnimationFrame(animate)
        engine.renderer.render(engine.scene, engine.camera)
        engine.renderer.render(engine.hud.scene, engine.hud.cam)
        {
            let cube = engine.objects.get("maincube") as THREE.Mesh
            // cube.rotation.x += 0.01
            // cube.rotation.y += 0.01
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
        playersData = new Array<Player>(2)
        playersData[0] = new Player("GogoLeDozo")
        playersData[1] = new Player("HornyBoiii")
        engine.renderer.setSize(size.x, size.y)
        engine.camera.position.z = 12
        document
            .getElementById("gameContainer")
            ?.replaceChildren(engine.renderer.domElement)
    }

    initEngine()
    initScene()
    animate()
}
