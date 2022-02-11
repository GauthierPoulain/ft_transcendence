class WebSocketService {
    _ws: WebSocket | null
    WSUrl: URL

    constructor(url: URL) {
        this.WSUrl = url
        this._ws = null
    }

    connect() {
        this._ws = new WebSocket(this.WSUrl)
    }

    close() {
        this._ws?.close()
        this._ws = null
    }

    isConnected() {
        return this._ws != null
    }

    emit(event: string, data: any = null) {
        return this._ws?.send(JSON.stringify({ event: event, data: data }))
    }

    onOpen(callback: (this: WebSocket, ev: Event) => any) {
        if (this._ws) this._ws.onopen = callback
    }

    onMessage(callback: (this: WebSocket, ev: MessageEvent<any>) => any) {
        if (this._ws) this._ws.onmessage = callback
    }

    onError(callback: (this: WebSocket, ev: Event) => any) {
        if (this._ws) this._ws.onerror = callback
    }

    onClose(callback: (this: WebSocket, ev: CloseEvent) => any) {
        if (this._ws) this._ws.onclose = callback
    }
}

export default WebSocketService
