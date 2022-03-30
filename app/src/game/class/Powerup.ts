import Player from "./Player"
import * as THREE from "three"
import { Iengine } from "./Interface"
import Lobby from "./Lobby"

enum PowerUpTypes {
    DEFAULT = "default",
    SPEED = "speed",
    LARGE = "large",
    SMALL = "small",
    RANDOMDIR = "random_direction",
}

export default class PowerUp {
    _pos: { x: number; z: number }
    _type: string
    _id: number
    _effect: (sender: Player) => void
    _reset: () => void
    _animation: (delta: number) => void
    _sender: Player
    _mesh: THREE.Mesh
    _ctx: Iengine
    _radius: number = 0
    _lobbyCtx: Lobby
    _actionTimeout: any | undefined = undefined

    constructor(
        ctx: Iengine,
        lobbyCtx: Lobby,
        id: number,
        type: PowerUpTypes | string,
        x: number,
        z: number,
        r?: number
    ) {
        this._lobbyCtx = lobbyCtx
        this._id = id
        this._ctx = ctx
        switch (type) {
            case PowerUpTypes.DEFAULT:
                if (!r)
                    throw new Error("radius requiered for " + type + " powerUp")
                this._pos = { x: x, z: z }
                this._radius = r
                this._type = type
                this._effect = (sender: Player) => {
                    console.log(`powerup ${this._type} triggered`, sender.name)
                    this._sender = sender
                    this._actionTimeout = setTimeout(() => {
                        this._reset.bind(this)
                    }, 1000)
                }
                this._reset = () => {
                    console.log(
                        `powerup ${this._type} reset`,
                        this._sender!.name
                    )
                }
                this._animation = (delta: number) => {
                    this._mesh.rotation.y += 3 * delta
                }
                {
                    const geo = new THREE.DodecahedronBufferGeometry(r)
                    const mat = new THREE.MeshPhongMaterial({
                        color: 0xffffff,
                    })
                    this._mesh = new THREE.Mesh(geo, mat)
                    this._mesh.castShadow = true
                    this._mesh.position.set(x, 0.3, z)
                    this._ctx.scene.add(this._mesh)
                }
                break
        }
        this._ctx.powerUps.set(this._id, this)
        lobbyCtx.broadcast("game:powerupSpawn", {
            id: 1,
            type: "default",
            x: 3,
            z: 0,
            r: 1,
        })
    }

    trigger(sender: Player) {
        this._effect(sender)
        // this._destroy()
        this._lobbyCtx.broadcast("game:powerupTrigger", {
            id: this._id,
            sender: sender,
        })
    }

    animate(delta: number) {
        this._animation(delta)
    }

    collisionCheck(quoitMesh: THREE.Mesh, quoitRadius: number) {
        return collisionCylCyl(this._mesh, this._radius, quoitMesh, quoitRadius)
    }

    _destroy() {
        if (this._actionTimeout != undefined) clearTimeout(this._actionTimeout)
        if (this._reset) this._reset()
        this._ctx.powerUps.delete(this._id)
        this._ctx.scene.remove(this._mesh)
        this._lobbyCtx.broadcast("game:powerupDestroy", { id: this._id })
    }
}

function collisionCylCyl(
    cyl1: THREE.Mesh,
    cyl1R: number,
    cyl2: THREE.Mesh,
    cyl2R: number
) {
    const Csp1 = new THREE.Sphere(cyl1.position, cyl1R)
    const Csp2 = new THREE.Sphere(cyl2.position, cyl2R)
    return Csp1.intersectsSphere(Csp2)
}
