export class HttpError extends Error {
    status: number

    constructor(status: number, ...params: any[]) {
        super(...params)

        this.name = "HttpError"
        this.status = status
    }
}
