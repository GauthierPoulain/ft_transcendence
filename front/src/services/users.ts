import { createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import { api } from "."
import { RootState } from "./store"

export type User = {
    id: number
    intra_login: string
    nickname: string
    image: string
}

const usersAdapter = createEntityAdapter<User>()

const slice = createSlice({
    name: "users",
    initialState: usersAdapter.getInitialState(),
    reducers: {},
})

export const reducer = slice.reducer

export const usersSelectors = usersAdapter.getSelectors<RootState>(
    (state) => state.users
)
