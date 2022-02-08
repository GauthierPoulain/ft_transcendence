import type { EndpointInterface, Manager, Middleware } from "@rest-hooks/core"

export default class StreamManager implements Manager {
	websocket: WebSocket
	middleware: Middleware

	constructor(url: string) {
		this.websocket = new WebSocket(url)

		this.middleware = (_middle) => {

			console.log(_middle);
			return (next) => async (action) => {
				console.log("before", _middle.getState(), action)
				await next(action)
				console.log("after", _middle.getState(), action)
			}
		}
	}

	cleanup(): void {
	    
	}

	getMiddleware(): Middleware {
	    return this.middleware
	}
}
