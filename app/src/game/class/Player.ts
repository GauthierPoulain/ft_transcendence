export default class Player {
    name: string
    score: number = 0
    x: number = 0
    width: number = 3
    color: number = 0xffffff

    constructor(name: string, color: number) {
        this.name = name
        this.color = color
    }
}
