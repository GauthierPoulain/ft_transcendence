import { api } from "./api"
import { createSlice } from "@reduxjs/toolkit"
import { RootState, store } from "./store"
import { BaseResource } from "../api/resources/BaseResource"
import { User, usersSelectors } from "./users"
import { useSelector } from "react-redux"

export type ExchangeCodeRequest = {
    code: string
    redirect_uri: string
}

export type ExchangeCodeResponse = {
    token: string
    created: boolean
    user: User
}

type AuthState = {
    token: string | null
    user: number | null
}

const slice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        user: null,
    } as AuthState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            api.endpoints.login.matchFulfilled,
            (state, { payload }) => {
                state.token = payload.token
                state.user = payload.user.id

                console.log(api)

                // TODO: Remove when we get rid of rest hooks
                BaseResource.accessToken = payload.token
            }
        )
    },
})

export const reducer = slice.reducer

export const isConnected = (state: RootState) => state.auth.user !== null
export const currentUserId = (state: RootState) => state.auth.user

export function useAuth() {
    return {
        connected: useSelector(isConnected),
        userId: useSelector(currentUserId)
    }
}
