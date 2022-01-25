const main = () => {
    const socket = io("http://localhost:3000");

    socket.on("connection", () => {
        socket.emit("open", "hello");
    });
};

main();
