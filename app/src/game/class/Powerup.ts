import Player from "./Player"
import * as THREE from "three"
import { Iengine } from "./Interface"
import Lobby, { collisionBoxBox } from "./Lobby"

const PowerUpTypes = {
    DEFAULT: {
        name: "DEFAULT",
        effect: (ctx: PowerUp) => {
            console.log(`template triggered by ${ctx._sender}`)
        },
        reset: (ctx: PowerUp) => {
            console.log(`template reset`)
        },
        initMesh: (ctx: PowerUp, x: number, z: number, r?: number) => {
            const geo = new THREE.DodecahedronBufferGeometry(r)
            const mat = new THREE.MeshPhongMaterial({
                color: 0xffffff,
            })
            let mesh = new THREE.Mesh(geo, mat)
            mesh.castShadow = true
            mesh.position.set(x, 0.3, z)
            ctx._ctx.scene.add(mesh)
            return mesh
        },
        animation: (ctx: PowerUp, delta: number) => {
            ctx._mesh.rotation.y += 3 * delta
        },
        time: 3000,
    },
    BIGBAR: {
        name: "BIGBAR",
        effect: (ctx: PowerUp) => {
            console.log(`bigbar triggered by ${ctx._sender}`)
            {
                const wallP = ctx._ctx.objects.get("map_border1") as THREE.Mesh
                const wallN = ctx._ctx.objects.get("map_border2") as THREE.Mesh
                ctx._sender.width = 5
                ctx._lobbyCtx.syncMeshs()
                let to: number
                if (
                    collisionBoxBox(
                        ctx._ctx.objects.get(ctx._sender.meshName),
                        wallP
                    )
                )
                    to = ctx._lobbyCtx._map.width / 2 - 2.5
                if (
                    collisionBoxBox(
                        ctx._ctx.objects.get(ctx._sender.meshName),
                        wallN
                    )
                )
                    to = -(ctx._lobbyCtx._map.width / 2 - 2.5)
                ctx._lobbyCtx.movePlayer(
                    ctx._sender.id == 1 ? "one" : "two",
                    { x: to },
                    true
                )
            }
        },
        reset: (ctx: PowerUp) => {
            console.log(`bigbar reset`)
            ctx._sender!.width = 3
        },
        initMesh: (ctx: PowerUp, x: number, z: number, r?: number) => {
            const geo = new THREE.DodecahedronBufferGeometry(r)
            const mat = new THREE.MeshPhongMaterial({
                color: 0x00ffff,
            })
            let mesh = new THREE.Mesh(geo, mat)
            mesh.castShadow = true
            mesh.position.set(x, 0.3, z)
            ctx._ctx.scene.add(mesh)
            return mesh
        },
        animation: (ctx: PowerUp, delta: number) => {
            ctx._mesh.rotation.y += 3 * delta
        },
        time: 7000,
    },
    SMOLBAR: {
        name: "SMOLBAR",
        effect: (ctx: PowerUp) => {
            console.log(`smolbar triggered by ${ctx._sender}`)
            if (ctx._sender == ctx._lobbyCtx._currentData.players.one) {
                ctx._lobbyCtx._currentData.players.two.width = 1
            } else {
                ctx._lobbyCtx._currentData.players.one.width = 1
            }
        },
        reset: (ctx: PowerUp) => {
            console.log(`smolbar reset`)
            let _target: Player
            if (ctx._sender == ctx._lobbyCtx._currentData.players.one) {
                _target = ctx._lobbyCtx._currentData.players.two
            } else {
                _target = ctx._lobbyCtx._currentData.players.one
            }
            {
                const wallP = ctx._ctx.objects.get("map_border1") as THREE.Mesh
                const wallN = ctx._ctx.objects.get("map_border2") as THREE.Mesh
                _target.width = 3
                ctx._lobbyCtx.syncMeshs()
                let to: number
                if (
                    collisionBoxBox(
                        ctx._ctx.objects.get(_target.meshName),
                        wallP
                    )
                )
                    to = ctx._lobbyCtx._map.width / 2 - 1.5
                if (
                    collisionBoxBox(
                        ctx._ctx.objects.get(_target.meshName),
                        wallN
                    )
                )
                    to = -(ctx._lobbyCtx._map.width / 2 - 1.5)
                ctx._lobbyCtx.movePlayer(
                    _target.id == 1 ? "one" : "two",
                    { x: to },
                    true
                )
            }
        },
        initMesh: (ctx: PowerUp, x: number, z: number, r?: number) => {
            const geo = new THREE.DodecahedronBufferGeometry(r)
            const mat = new THREE.MeshPhongMaterial({
                color: 0x00ff00,
            })
            let mesh = new THREE.Mesh(geo, mat)
            mesh.castShadow = true
            mesh.position.set(x, 0.3, z)
            ctx._ctx.scene.add(mesh)
            return mesh
        },
        animation: (ctx: PowerUp, delta: number) => {
            ctx._mesh.rotation.y -= 3 * delta
        },
        time: 7000,
    },
    // SPEED = "speed",
    // SMALL = "small",
    // RANDOMDIR = "random_direction",
}

enum PowerUpStates {
    IDLE = 0,
    TRIGGERED = 1,
    DESTROYED = 2,
}

class PowerUp {
    _pos: { x: number; z: number }
    _type: {
        name: string
        effect: (ctx: PowerUp) => void
        reset: (ctx: PowerUp) => void
        initMesh: (ctx: PowerUp, x: number, z: number, r?: number) => THREE.Mesh
        animation: (ctx: PowerUp, delta: number) => void
        time: number
    }
    _id: number
    _effect: () => void
    _reset: (fromDestroy?: boolean) => void
    _animation: (delta: number) => void
    _sender: Player
    _mesh: THREE.Mesh
    _ctx: Iengine
    _radius: number = 0
    _lobbyCtx: Lobby
    _actionTimeout: any | undefined = undefined
    _state: PowerUpStates

    constructor({
        ctx,
        lobbyCtx,
        id,
        type,
        x,
        z,
        r,
    }: {
        ctx: Iengine
        lobbyCtx: Lobby
        id: number
        type: {
            name: string
            effect: (ctx: PowerUp) => void
            reset: (ctx: PowerUp) => void
            initMesh: (
                ctx: PowerUp,
                x: number,
                z: number,
                r?: number
            ) => THREE.Mesh
            animation: (ctx: PowerUp, delta: number) => void
            time: number
        }
        x: number
        z: number
        r?: number
    }) {
        this._radius = r
        this._pos = { x: x, z: z }
        this._lobbyCtx = lobbyCtx
        this._id = id
        this._ctx = ctx
        this._type = type
        this._mesh = this._type.initMesh(this, x, z)
        this._animation = (delta: number) => {
            this._type.animation(this, delta)
        }
        this._effect = () => {
            this._type.effect(this)
            lobbyCtx.sendData(true)
        }
        this._reset = () => {
            this._type.reset(this)
            this._destroy()
            lobbyCtx.sendData(true)
        }
        this._state = PowerUpStates.IDLE
    }

    trigger(sender: Player) {
        if (this._state != PowerUpStates.IDLE) return
        this._state = PowerUpStates.TRIGGERED
        this._sender = sender
        this._effect()
        this._ctx.scene.remove(this._mesh)
        const that = this
        this._actionTimeout = setTimeout(() => {
            that._reset()
        }, this._type.time)
    }

    animate(delta: number) {
        this._animation(delta)
    }

    collisionCheck(quoitMesh: THREE.Mesh, quoitRadius: number) {
        return collisionCylCyl(this._mesh, this._radius, quoitMesh, quoitRadius)
    }

    getBasicInfos() {
        return {
            id: this._id,
            typeName: this._type.name,
            pos: this._pos,
            sender: this._sender ? this._sender.id : null,
            state: this._state,
            radius: this._radius,
        }
    }

    _destroy() {
        if (this._actionTimeout != undefined) clearTimeout(this._actionTimeout)
        if (this._state == PowerUpStates.DESTROYED) return
        this._state = PowerUpStates.DESTROYED
        if (this._reset && this._sender) this._reset()
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

export default PowerUp
export { PowerUpTypes, PowerUpStates }
