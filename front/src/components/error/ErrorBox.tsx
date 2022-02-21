import { HttpError } from "../../errors/HttpError"

function title(error: any): string {
    if (error instanceof HttpError) {
        if (error.status === 404) {
            return "The resource doesn't exist."
        }

        if (error.status === 401) {
            return "You're not allowed here!"
        }
    }

    return "Too bad, an error occured..."
}

function subtitle(error: any): string {
    if (error instanceof HttpError) {
        if (error.status === 401) {
            return "Go see somewhere else!"
        }
    }

    return "Maybe retry later?"
}

export function ErrorBox({ error }) {
    return (
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
            <div>
                <h2>{title(error)}</h2>
                <p>{subtitle(error)}</p>
            </div>
        </div>
    )
}
