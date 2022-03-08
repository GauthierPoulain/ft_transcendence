import PowerUp from "./Powerup"

interface Iengine {
    scene: THREE.Scene
    objects: Map<string, any>
    powerUps: Map<number, PowerUp>
}

export {Iengine}