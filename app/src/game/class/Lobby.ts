import Client from "./Client"

export default class Lobby {
    _lastData: {
        _time: Date
        player1: { y: 0 }
        player2: { y: 0 }
        ball: { x: 0; y: 0 }
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
