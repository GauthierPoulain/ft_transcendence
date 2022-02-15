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
        renderer: new THREE.WebGLRenderer({ antialias: true }),
        camera: new THREE.PerspectiveCamera(75, size.x / size.y, 0.1, 1000),
        objects: new Map<string, any>(),
    }

    var remoteData = {}

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
        {
            let cube = engine.objects.get("maincube") as THREE.Mesh
            cube.rotation.x += 0.01
            cube.rotation.y += 0.01
        }
    }

    function initScene() {
        {
            const geometry = new THREE.BoxGeometry()
            const material = new THREE.MeshBasicMaterial({ color: 0xaa00aa })
            const cube = new THREE.Mesh(geometry, material)
            engine.objects.set("maincube", cube)
            engine.scene.add(cube)
        }
    }

    function initEngine() {
        playersData = new Array<Player>(2)
        playersData[0] = new Player("GogoLeDozo")
        playersData[1] = new Player("HornyBoiii")
        engine.renderer.setSize(size.x, size.y)
        engine.camera.position.z = 5
        document
            .getElementById("gameContainer")
            ?.replaceChildren(engine.renderer.domElement)
    }

    initEngine()
    initScene()
    animate()
}
