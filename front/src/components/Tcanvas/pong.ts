import WebSocketService from "../../WebSocketService"

interface Igame {
    player: any
    opponent: any
    ball: {
        r: number
        x: number
        y: number
        speed: {
            x: number
            y: number
        }
    }
}

interface IWSPayload {
    event: string
    data: any
}

function pong(props: { width: number; height: number }, ws: WebSocketService) {
    ws.onMessage((e) => {
        console.log(e)
    })

    var canvas: any
    var game: Igame

    var connectionData = {
        roomName: "",
        host: "",
        ready: false,
        isHost: false,
        remoteBall: { XPos: 0, YPos: 0 },
    }

    const PLAYER_H = 100
    const PLAYER_W = 5

    function clear() {
        console.log("Cleared !")
        var ctx = canvas.getContext("2d")
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
        } else {
            if (Math.abs(game.ball.speed.x) > 1) game.ball.speed.x *= -1
            else game.ball.speed.x *= -1.2
        }
        changeDirection(player.y)
    }

    function ballMove(delta: number) {
        if (game.ball.y + game.ball.r > canvas.height)
            game.ball.speed.y = -Math.abs(game.ball.speed.y)
        else if (game.ball.y - game.ball.r < 0)
            game.ball.speed.y = Math.abs(game.ball.speed.y)
        if (game.ball.x + game.ball.r > canvas.width - PLAYER_W)
            collide(game.opponent)
        else if (game.ball.x - game.ball.r < PLAYER_W) collide(game.player)

        game.ball.x += game.ball.speed.x * 100 * delta
        game.ball.y += game.ball.speed.y * 100 * delta
    }

    function animate(delta) {
        if (connectionData.isHost) {
            ballMove(delta)
            ws.emit("game:moveBall", {
                XPos: game.ball.x,
                YPos: game.ball.y,
            })
        } else {
            game.ball.x = canvas.width - connectionData.remoteBall.XPos
            game.ball.y = connectionData.remoteBall.YPos
        }
    }

    var lastRender = Date.now()
    function loop() {
        if (!connectionData.ready) {
            return
        }
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

    function load(event) {
        ws.onMessage((e: any) => {
            const { event: ev_name, data } = JSON.parse(e.data)

            switch (ev_name) {
                case "client:identify":
                    ws.clientId = data.id
                    console.log("ws connected as", ws.clientId)
                    ws.emit("room:join", { name: "main" })

                    break
                case "auth:request":
                    //TODO: le truc avec les tokens
                    break

                case "room:joinSuccess":
                    console.log("room joined")
                    break

                case "room:infos":
                    connectionData.roomName = data.name
                    connectionData.host = data.host
                    connectionData.isHost = ws.clientId == data.host
                    connectionData.ready = data.ready
                    console.log(connectionData)

                    if (connectionData.ready) loop()

                    break

                case "room:joinFail":
                    console.log("room join error ", data)
                    break

                case "game:playerMove":
                    opponent_move(data.YPos)
                    break

                case "game:ballMove":
                    connectionData.remoteBall = data
                    break

                default:
                    console.log("unregistered event:", ev_name)
                    break
            }
        })

        canvas = document.getElementById("pong") as HTMLCanvasElement
        game = {
            player: {
                y: canvas.height / 2 - PLAYER_H / 2,
            },
            opponent: {
                y: canvas.height / 2 - PLAYER_H / 2,
            },
            ball: {
                x: canvas.width / 2,
                y: canvas.height / 2,
                r: 5,
                speed: {
                    x: -2,
                    y: -2,
                },
            },
        }
        canvas.addEventListener("mousemove", (e: MouseEvent) => {
            {
                var canvasLoc = canvas.getBoundingClientRect()
                var mouseLoc = e.clientY - canvasLoc.y
                if (mouseLoc < PLAYER_H / 2) game.player.y = 0
                else if (mouseLoc > canvas.height - PLAYER_H / 2)
                    game.player.y = canvas.height - PLAYER_H
                else game.player.y = mouseLoc - PLAYER_H / 2
                if (connectionData.ready)
                    ws.emit("game:movePlayer", { YPos: e.clientY })
            }
        })
        // loop()
    }

    ws.onOpen(load)
    ws.willConnect = true
}

export default pong
