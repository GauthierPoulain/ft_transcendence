export default class Player {
    name: string
    score: number = 0
    x: number = 0
    width: number = 3
    color: number = 0xffffff
    meshName: string
    last: number
    id: number

    constructor(id: number, name: string, color: number, meshName: string) {
        this.id = id
        this.name = name
        this.color = color
        this.meshName = meshName
        this.last = Date.now()
    }
}
