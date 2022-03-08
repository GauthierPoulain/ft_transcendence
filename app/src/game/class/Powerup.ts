import Player from "./Player"
import * as THREE from "three"

enum PowerUpTypes {
    DEFAULT = "default",
}

class PowerUp {
    _pos: { x: number; z: number }
    _type: string
    _id: number
    _effect: (sender: Player) => void
    _animation: (delta: number) => void
    _mesh: THREE.Mesh
    _ctx: {
        scene: THREE.Scene
        objects: Map<string, any>
        powerUp: Map<number, PowerUp>
    }
    _radius: number = 0

    constructor(
        ctx: {
            scene: THREE.Scene
            objects: Map<string, any>
            powerUp: Map<number, PowerUp>
        },
        id: number,
        type: PowerUpTypes,
        x: number,
        z: number,
        r?: number
    ) {
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
        this._ctx.powerUp.set(this._id, this)
    }

    trigger(sender: Player) {
        this._effect(sender)
        this._destroy()
    }

	
    animate(delta: number) {
		this._animation(delta)
    }

    collisionCheck(quoitMesh: THREE.Mesh, quoitRadius: number) {
		return collisionCylCyl(this._mesh, this._radius, quoitMesh, quoitRadius)
    }

    _destroy() {
        this._ctx.powerUp.delete(this._id)
        this._ctx.scene.remove(this._mesh)
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