interface Igame {
    player: any
    opponent: any
    ball: any
}

interface IWSPayload {
    event: string
    data: any
}

class WebSocketService extends WebSocket {
    emit(event: string, data: any = null) {
        return this.send(JSON.stringify({ event: event, data: data }))
    }
}

function pong(props: any) {
    console.log(props)

    // const socket = new WebSocketService(
    //     `ws://${document.location.hostname}:3005`
    // )
    const g_canvas = document.getElementById("pong") as HTMLCanvasElement
    var canvas: any
    var game: Igame

    const PLAYER_H = 100
    const PLAYER_W = 5

    function clear() {
        console.log("Cleared !")
        console.log(g_canvas)
        var ctx = g_canvas.getContext("2d")
        if (ctx) ctx.clearRect(0, 0, props.width, props.height)
    }

    function draw() {
        var context = canvas.getContext("2d")
        // Draw field
        context.fillStyle = "black"
        context.fillRect(0, 0, canvas.width, canvas.height)
        // Draw middle line
        context.strokeStyle = "white"
        context.beginPath()
        context.moveTo(canvas.width / 2, 0)
        context.lineTo(canvas.width / 2, canvas.height)
        context.stroke()

        // Draw players
        context.fillStyle = "white"
        context.fillRect(0, game.player.y, PLAYER_W, PLAYER_H)
        context.fillRect(
            canvas.width - PLAYER_W,
            game.opponent.y,
            PLAYER_W,
            PLAYER_H
        )

        // Draw ball
        context.beginPath()
        context.fillStyle = "white"
        context.arc(
            game.ball.x,
            game.ball.y,
            game.ball.r,
            0,
            Math.PI * 2,
            false
        )
        context.fill()
    }

    function changeDirection(playerPos: any) {
        var impact = game.ball.y - playerPos - PLAYER_H / 2
        var ratio = 100 / (PLAYER_H / 2)
        game.ball.speed.y = Math.round((impact * ratio) / 10)
    }

    function collide(player: any) {
        if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_H) {
            game.ball.x = canvas.width / 2
            game.ball.y = canvas.height / 2
            game.player.y = canvas.height / 2 - PLAYER_H / 2
            game.opponent.y = canvas.height / 2 - PLAYER_H / 2
            game.ball.speed.x = 2
            game.ball.speed.y = -2
        } else game.ball.speed.x *= -1.2
        changeDirection(player.y)
    }

    function ballMove(delta: number) {
        if (game.ball.y > canvas.height || game.ball.y < 0)
            game.ball.speed.y *= -1
        if (game.ball.x > canvas.width - PLAYER_W) collide(game.opponent)
        else if (game.ball.x < PLAYER_W) collide(game.player)
        game.ball.x += game.ball.speed.x * 100 * delta
        game.ball.y += game.ball.speed.y * 100 * delta
    }

    function animate(delta) {
        ballMove(delta)
    }

    var lastRender = Date.now()
    function loop() {
        requestAnimationFrame(loop)
        const current = Date.now()
        const delta = (current - lastRender) / 1000
        draw()
        animate(delta)
        lastRender = current
    }

    function opponent_move(YPos: number) {
        var canvasLoc = canvas.getBoundingClientRect()
        var mouseLoc = YPos - canvasLoc.y
        if (mouseLoc < PLAYER_H / 2) game.opponent.y = 0
        else if (mouseLoc > canvas.height - PLAYER_H / 2)
            game.opponent.y = canvas.height - PLAYER_H
        else game.opponent.y = mouseLoc - PLAYER_H / 2
    }

    // function load(event) {
    //     console.log(event)

    //     socket.onmessage = (event) => {
    //         const payload = JSON.parse(event.data) as IWSPayload

    //         switch (payload.event) {
    //             case "game:opponentmove":
    //                 opponent_move(payload.data.YPos)
    //                 break

    //             default:
    //                 break
    //         }
    //     }

    //     socket.emit("game:join")

    //     canvas = document.getElementById("pong") as HTMLCanvasElement
    //     game = {
    //         player: {
    //             y: canvas.height / 2 - PLAYER_H / 2,
    //         },
    //         opponent: {
    //             y: canvas.height / 2 - PLAYER_H / 2,
    //         },
    //         ball: {
    //             x: canvas.width / 2,
    //             y: canvas.height / 2,
    //             r: 5,
    //             speed: {
    //                 x: -2,
    //                 y: -2,
    //             },
    //         },
    //     }
    //     canvas.addEventListener("mousemove", (e: MouseEvent) => {
    //         {
    //             var canvasLoc = canvas.getBoundingClientRect()
    //             var mouseLoc = e.clientY - canvasLoc.y

    //             if (mouseLoc < PLAYER_H / 2) game.player.y = 0
    //             else if (mouseLoc > canvas.height - PLAYER_H / 2)
    //                 game.player.y = canvas.height - PLAYER_H
    //             else game.player.y = mouseLoc - PLAYER_H / 2
    //             socket.emit("game:playermove", { YPos: e.clientY })
    //         }
    //     })
    //     loop()
    // }

    // socket.onopen = load
}

export default pong
