import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ExchangeCodeRequest, ExchangeCodeResponse } from "../auth"
import { User } from "../users"
import { Channel } from "../channels"

const baseUrl = "http://localhost:3005/api"

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl,
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

        publicChannels: builder.query<number[], void>({
            query: () => "channels",
            transformResponse(channels: Channel[]) {
                return channels.map(({ id }) => id)
            }
        })
    }),
})
