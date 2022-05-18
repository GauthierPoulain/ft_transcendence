import { createContext, useContext, useMemo, useState } from "react"
import { fetcher, setAccessToken } from "./use-fetch"
import { User } from "./use-user"

export type ExchangeCodeRequest = {
    code: string
    redirect_uri: string
}

export type ExchangeCodeResponse = {
    token: string
    created: boolean
    user: User
}

export type AuthState = {
    connected: boolean
    token: string
    userId: number
    created: boolean

    exchange: (request: ExchangeCodeRequest) => Promise<ExchangeCodeResponse>
    fakeExchange: (name: "one" | "two") => Promise<ExchangeCodeResponse>

    login: (response: ExchangeCodeResponse) => void
    logout: () => void
}

const Context = createContext<AuthState>({} as AuthState)

export function AuthProvider({ children }) {
    const [token, setToken] = useState<string>("")
    const [userId, setUserId] = useState<number>(0)
    const [created, setCreated] = useState<boolean>(false)

    const exchange = async (request: ExchangeCodeRequest) => {
        const response: ExchangeCodeResponse = await fetcher(`/auth/login`, {
            method: "POST",
            body: JSON.stringify(request),
        })

        return response
    }

    const login = (response: ExchangeCodeResponse) => {
        setAccessToken(response.token)
        setUserId(response.user.id)
        setToken(response.token)
        setCreated(response.created)
    }

    const fakeExchange = async (name: "one" | "two") => {
        const response: ExchangeCodeResponse = await fetcher(
            `/auth/fake_login_${name}`,
            {
                method: "POST",
            }
        )

        return response
    }

    const logout = () => {
        setAccessToken("")
        setUserId(0)
        setToken("")
    }

    const value = useMemo(() => {
        return {
            connected: !!token,
            userId,
            token,
            created,
            exchange,
            fakeExchange,
            login,
            logout,
        }
    }, [token])

    return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useAuth(): AuthState {
    return useContext(Context)
}
