import { configureStore } from "@reduxjs/toolkit"

import * as services from "./index"

export const store = configureStore({
	reducer: {
		[services.api.reducerPath]: services.api.reducer,
		auth: services.auth.reducer,
		users: services.users.reducer
	},

	middleware: (getDefault) => getDefault().concat(services.api.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
