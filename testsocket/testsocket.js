const main = () => {
    const socket = new WebSocket("ws://localhost:3005")

    socket.onopen = (event) => {
        console.log(event)
        console.log("Connected to socket")
    }

    socket.onclose = (event) => {
        console.log(event)
    }

    socket.onerror = (event) => {
        console.log(event)
    }

    socket.onmessage = (event) => {
        console.log(event)
    }
}

main()
