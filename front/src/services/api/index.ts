import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ExchangeCodeRequest, ExchangeCodeResponse } from "../auth"
import { User } from "../users"
import type { Channel, Membership } from "../channels"
import { RootState } from "../store"

const baseUrl = "http://localhost:3005/api"

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl,

        prepareHeaders(headers, { getState }) {
            const { token } = (getState() as RootState).auth

            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }

            return headers
        }
    }),

    endpoints: (builder) => ({
        login: builder.mutation<
            ExchangeCodeResponse,
            { body: ExchangeCodeRequest; url: string }
        >({
            query: ({ body, url }) => ({
                url: `auth/${url}`,
                method: "POST",
                body,
            }),
        }),

        getUser: builder.query<User, number>({
            query: (id) => `users/${id}`
        }),

        getChannel: builder.query<Channel, number>({
            query: (id) => `channels/${id}`
        }),

        getChannelMembers: builder.query<Membership[], number>({
            query: (id) => `channels/${id}/members`
        }),

        publicChannels: builder.query<number[], void>({
            query: () => "channels",
            transformResponse(channels: Channel[]) {
                return channels.map(({ id }) => id)
            }
        }),

        joinedChannels: builder.query<number[], void>({
            query: () => "channels/joined"
        })
    }),
})
