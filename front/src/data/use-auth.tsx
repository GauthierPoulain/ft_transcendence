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
    token?: string
    userId?: number

    login: (request: ExchangeCodeRequest) => Promise<void>
    fakeLogin: (name: "one" | "two") => Promise<void>
}

const Context = createContext<AuthState>({} as AuthState)

export function AuthProvider({ children }) {
    const [token, setToken] = useState<string>("")
    const [userId, setUserId] = useState<number>(0)

    const login = async (request: ExchangeCodeRequest) => {
        const response: ExchangeCodeResponse = await fetcher(`/auth/login`, {
            method: "POST",
            body: JSON.stringify(request),
        })

        setAccessToken(response.token)
        setUserId(response.user.id)
        setToken(response.token)
    }

    const fakeLogin = async (name: "one" | "two") => {
        const response: ExchangeCodeResponse = await fetcher(
            `/auth/fake_login_${name}`,
            {
                method: "POST",
            }
        )

        setAccessToken(response.token)
        setUserId(response.user.id)
        setToken(response.token)
    }

    const value = useMemo(() => {
        return {
            connected: !!token,
            userId,
            token,
            login,
            fakeLogin,
        }
    }, [token])

    return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useAuth(): AuthState {
    return useContext(Context)
}
