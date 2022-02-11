import { createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import { api } from "."
import { RootState } from "./store"

export type User = {
    id: number
    intra_login: string
    intra_image_url: string
}

const usersAdapter = createEntityAdapter<User>()

const slice = createSlice({
    name: "users",
    initialState: usersAdapter.getInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            api.endpoints.login.matchFulfilled,
            (state, { payload }) => {
                usersAdapter.addOne(state, payload.user)
            }
        )
    },
})

export const reducer = slice.reducer

export const usersSelectors = usersAdapter.getSelectors<RootState>(
    (state) => state.users
)
