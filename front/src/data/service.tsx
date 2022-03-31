import {
    Context,
    createContext,
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
} from "react"
import { Repository, Entity, State } from "./repository"
import { useWebSocket } from "./use-websocket"

type Service<T, U> = {
    Context: Context<{ state: State<T>; loading: boolean }>
    Provider: [U] extends [void]
        ? ({ children }: { children: any }) => JSX.Element
        : ({
              children,
              settings,
          }: {
              children: any
              settings: U
          }) => JSX.Element
}

type ServiceSettings<T, ProviderSettings> = {
    name: string

    repository: Repository<T>

    fetcher: (settings: ProviderSettings) => Promise<T[]>

    onCreated?: (
        data: T,
        setState: Dispatch<SetStateAction<State<T>>>,
        settings: ProviderSettings
    ) => void
    onUpdated?: (
        data: T,
        setState: Dispatch<SetStateAction<State<T>>>,
        settings: ProviderSettings
    ) => void
    onRemoved?: (
        id: number,
        setState: Dispatch<SetStateAction<State<T>>>,
        settings: ProviderSettings
    ) => void
}

export function createService<T extends Entity, U>(
    serviceSettings: ServiceSettings<T, U>
): Service<T, U> {
    const Context = createContext<{ state: State<T>; loading: boolean }>(
        {} as any
    )

    function Provider({ children, settings }: { settings: U; children: any }) {
        const { subscribe } = useWebSocket()
        const [state, setState] = useState(
            serviceSettings.repository.initialState()
        )
        const [loading, setLoading] = useState(true)
        const [mounted, setMounted] = useState(true)

        useEffect(() => {
            console.log("Provider.Fetching", serviceSettings.name, settings)
            setLoading(true)
            setMounted(true)
            setState(serviceSettings.repository.initialState())

            serviceSettings.fetcher(settings).then((state) => {
                if (mounted) {
                    setState(serviceSettings.repository.setAll(state))
                    setLoading(false)
                }
            })

            return () => setMounted(false)
        }, [settings])

        useEffect(() => {
            if (loading) return

            const { unsubscribe } = subscribe((event, data) => {
                if (event === `${serviceSettings.name}.created`) {
                    serviceSettings.onCreated?.(data, setState, settings)
                }

                if (event === `${serviceSettings.name}.updated`) {
                    serviceSettings.onUpdated?.(data, setState, settings)
                }

                if (event === `${serviceSettings.name}.removed`) {
                    serviceSettings.onRemoved?.(data.id, setState, settings)
                }
            })

            return unsubscribe
        }, [settings, loading])

        return (
            <Context.Provider value={{ state, loading }}>
                {children}
            </Context.Provider>
        )
    }

    return {
        Context,
        Provider: Provider as any,
    }
}
