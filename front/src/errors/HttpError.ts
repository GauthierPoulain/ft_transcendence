export class HttpError extends Error {
    status: number
    api_message?: string

    constructor(status: number, message?: string, ...params: any[]) {
        super(...params)

        this.name = "HttpError"
        this.status = status
        this.api_message = message
    }
}
