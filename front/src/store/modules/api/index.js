import axios from "axios"

export const namespaced = false;

// TODO: Create an utility library to easily bind server resources to this local store.

export const actions = {
    async me({ rootGetters, rootState }) {
        if (!rootGetters["auth/isConnected"]) {
            // Create custom errors
            throw new Error("Not connected")
        }

        const { data } = await axios.get("http://localhost:3000/api/users/me", {
            headers: {
                Authorization: `Bearer ${rootState.auth.token}`
            }
        })

        return data
    }
}
