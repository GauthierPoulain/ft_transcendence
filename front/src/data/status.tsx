import { useContext } from "react";
import { createRepository } from "./repository";
import { createService } from "./service";
import { fetcher } from "./use-fetch";

type Status = {
    // It corresponds to the id of an User.
    id: number

    status: number
};

const repository = createRepository<Status>();

const service = createService<Status, void>({
    name: "status",
    repository,

    async fetcher() {
        const response = await fetcher("/status")

        return Object.entries(response).map(
            ([id, status]) => ({ id: parseInt(id, 10), status: status as number })
        )
    },

    onCreated(data, setState) {
        setState((state) => repository.addOne(state, data))
    },

    onUpdated(data, setState) {
        setState((state) => repository.updateOne(state, data))
    },

    onRemoved(id, setState) {
        setState((state) => repository.removeOne(state, id))
    },
})

export const StatusProvider = service.Provider

export function useStatus(userId: number) {
    const context = useContext(service.Context)
    const status = repository.selectById(context.state, userId)

    if (context.loading || !status) {
        return {
            isOnline: false,
            isOffline: true,
            isInGame: false,
            gameId: 0
        }
    }

    return {
        isOnline: true,
        isOffline: false,
        isInGame: status.status > 0,
        gameId: status.status
    }
}

export function statusText(status) {
    if (status.isOffline) {
        return "Offline"
    }

    if (status.isOnline) {
        return "Online"
    }

    return "Playing"
}

export function statusColor(status) {
    if (status.isOffline) {
        return "red"
    }

    if (status.isOnline) {
        return "lime"
    }

    return "purple"
}
