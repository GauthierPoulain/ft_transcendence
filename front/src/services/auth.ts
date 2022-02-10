import { api } from "./api"
import { createSlice } from "@reduxjs/toolkit"
import type { RootState } from "./store"
import { BaseResource } from "../api/resources/BaseResource"

export interface ExchangeCodeRequest {
	code: string,
	redirect_uri: string
}

export interface ExchangeCodeResponse {
	token: string
}

type AuthState = {
	connected: boolean,
	token: string | null
}

const slice = createSlice({
	name: "auth",
	initialState: {
		connected: false,
		token: null
	} as AuthState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(api.endpoints.login.matchFulfilled, (state, { payload }) => {
			state.token = payload.token
			state.connected = true
			
			// TODO: Remove when we get rid of rest hooks
			BaseResource.accessToken = payload.token
		})
	}
})

export const reducer = slice.reducer

export const isConnected = (state: RootState) => state.auth.connected
