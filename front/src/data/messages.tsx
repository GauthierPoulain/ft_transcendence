import { useContext } from "react"
import { fetcher } from "./use-fetch"
import { createRepository } from "./repository"
import { createService } from "./service"

export type Message = {
    id: number
    content: string
    authorId: number
    channelId: number
}

const repository = createRepository<Message>()

const service = createService<Message, number>({
    name: "messages",
    repository,

    fetcher(channelId) {
        return fetcher(`/channels/${channelId}/messages`)
    },

    onCreated(data, setState, channelId) {
        if (data.channelId === channelId) {
            setState((state) => repository.addOne(state, data))
        }
    },

    onRemoved(id, setState) {
        setState((state) => repository.removeOne(state, id))
    },
})

export const MessagesProvider = service.Provider

export function useMessages(): Message[] {
    const { state } = useContext(service.Context)

    return repository.selectAll(state)
}

export function useMessagesLoading(): boolean {
    return useContext(service.Context).loading
}
