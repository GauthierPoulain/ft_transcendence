class WebSocketService {
    _ws: WebSocket | null
    WSUrl: URL
    canConnect: boolean
    willConnect: boolean
    _onopen: ((this: WebSocket, ev: Event) => any) | undefined
    _onmessage: ((this: WebSocket, ev: MessageEvent<any>) => any) | undefined
    _onerror: ((this: WebSocket, ev: Event) => any) | undefined
    _onclose: ((this: WebSocket, ev: CloseEvent) => any) | undefined

    constructor(url: URL) {
        this.WSUrl = url
        this._ws = null
        this.canConnect = false
        this.willConnect = false
    }

    connect() {
        if (this.canConnect && this.willConnect) {
            this._ws = new WebSocket(this.WSUrl)
            if (this._onopen) this._ws.onopen = this._onopen
            if (this._onmessage) this._ws.onmessage = this._onmessage
            if (this._onerror) this._ws.onerror = this._onerror
            if (this._onclose) this._ws.onclose = this._onclose
        }
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
        this._onopen = callback
        if (this._ws) this._ws.onopen = callback
    }

    onMessage(callback: (this: WebSocket, ev: MessageEvent<any>) => any) {
        this._onmessage = callback
        if (this._ws) this._ws.onmessage = callback
    }

    onError(callback: (this: WebSocket, ev: Event) => any) {
        this._onerror = callback
        if (this._ws) this._ws.onerror = callback
    }

    onClose(callback: (this: WebSocket, ev: CloseEvent) => any) {
        this._onclose = callback
        if (this._ws) this._ws.onclose = callback
    }
}

export default WebSocketService
