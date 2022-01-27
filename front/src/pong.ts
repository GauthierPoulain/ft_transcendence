function pong(props:any) {
	console.log(props);
    var g_ctx = document.getElementById("pong");
    var canvas:any;
    var game:any;

    const PLAYER_H = 100;
    const PLAYER_W = 5;

    function clear() {
        console.log("Cleared !");
        console.log(g_ctx);
        var c = document.getElementById("pong") as HTMLCanvasElement;
		var ctx = c.getContext("2d");
		if (ctx)
			ctx.clearRect(0, 0, props.width, props.height);
    }

    function draw() {
        var context = canvas.getContext("2d");
        // Draw field
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
        // Draw middle line
        context.strokeStyle = "white";
        context.beginPath();
        context.moveTo(canvas.width / 2, 0);
        context.lineTo(canvas.width / 2, canvas.height);
        context.stroke();

        // Draw players
        context.fillStyle = "white";
        context.fillRect(0, game.player.y, PLAYER_W, PLAYER_H);
        context.fillRect(
            canvas.width - PLAYER_W,
            game.ai.y,
            PLAYER_W,
            PLAYER_H
        );

        // Draw ball
        context.beginPath();
        context.fillStyle = "white";
        context.arc(
            game.ball.x,
            game.ball.y,
            game.ball.r,
            0,
            Math.PI * 2,
            false
        );
        context.fill();
    }

    function changeDirection(playerPos:any) {
        var impact = game.ball.y - playerPos - PLAYER_H / 2;
        var ratio = 100 / (PLAYER_H / 2);
        game.ball.speed.y = Math.round((impact * ratio) / 10);
    }

    function collide(player:any) {
        if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_H) {
            game.ball.x = canvas.width / 2;
            game.ball.y = canvas.height / 2;
            game.player.y = canvas.height / 2 - PLAYER_H / 2;
            game.ai.y = canvas.height / 2 - PLAYER_H / 2;
            game.ball.speed.x = 2;
            game.ball.speed.y = -2;
        } else game.ball.speed.x *= -1.2;
        changeDirection(player.y);
    }

    function ballMove() {
        if (game.ball.y > canvas.height || game.ball.y < 0)
            game.ball.speed.y *= -1;
        if (game.ball.x > canvas.width - PLAYER_W) collide(game.ai);
        else if (game.ball.x < PLAYER_W) collide(game.player);
        game.ball.x += game.ball.speed.x;
        game.ball.y += game.ball.speed.y;
    }

    function loop() {
        ballMove();
        draw();
        requestAnimationFrame(loop);
    }

    function playerMove(e:any) {
        var canvasLoc = canvas.getBoundingClientRect();
        var mouseLoc = e.clientY - canvasLoc.y;

        game.player.y = mouseLoc - PLAYER_H / 2;
    }

    document.addEventListener("DOMContentLoaded", function () {
        console.log("ready!");
        canvas = document.getElementById("pong") as HTMLCanvasElement;
        game = {
            player: {
                y: canvas.height / 2 - PLAYER_H / 2,
            },
            ai: {
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
        };
        canvas.addEventListener("mousemove", playerMove);
        draw();
        loop();
    });
}

export default pong;