export const namespaced = true;

export const state = () => ({
    token: ""
})

export const getters = {
    isConnected: (state) => state.token.length !== 0
}

export const mutations = {
    connect(state, token) {
        state.token = token
    }
}
