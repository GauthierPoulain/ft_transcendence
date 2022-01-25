const main = () => {
    const socket = io("ws://localhost:3000");

    socket.on("connection", () => {
        console.log(`connected to socket as : ${socket.id}`);
        socket.emit("dummy", "hello");
    });

    socket.on("error", (data) => console.error);
};

main();
