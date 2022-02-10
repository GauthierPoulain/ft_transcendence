function logger(str, color) {
    document.getElementById(
        "logs"
    ).innerHTML += `<span style="color:${color}">${str}</span><br/>`;
}

const main = () => {
    const socket = io("ws://localhost:3005");

    socket.on("connection", () => {
        logger(`connected to socket as : ${socket.id}`, "cyan");
    });

    socket.on("dummy", (data) => {
        logger(data, "green");
    });

    socket.on("error", (err) => {
        logger(err, "red");
    });
};

main();
