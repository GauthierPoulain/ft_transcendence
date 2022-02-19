import Client from "./Client"

export default class Lobby {
    _currentData: {
        player1: { x: 0 }
        player2: { x: 0 }
        ball: {
            x: 0
            z: 0
            speed: { x: 0; z: 0 }
        }
    }
    player1: { score: 0; name: "player one" }
    player2: { score: 0; name: "player two" }
    _clients = new Array<Client>()

    constructor(player1: Client, player2: Client) {}

    simulate() {
        let current = {}
    }

    start() {
        setInterval(this.simulate, 100)
    }
}
