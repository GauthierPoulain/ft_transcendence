import PowerUp from "./Powerup"

interface Iengine {
    scene: THREE.Scene
    objects: Map<string, any>
    powerUp: Map<number, PowerUp>
}

export { Iengine }
