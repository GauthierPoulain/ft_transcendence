<template>
    <h1>Auth view</h1>

    <div v-if="!isConnected">
        <login-button />
    </div>

    <div v-if="isConnected">
        <p>Code in url, api token will be {{ token }}</p>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue"
import { useRoute } from "vue-router"
import axios from "axios"

import { useStore } from "vuex"

const route = useRoute()


const store = useStore()
console.log(store)

const isConnected = computed(() => store.getters["auth/isConnected"])
const token = computed(() => store.state.auth.token)

onMounted(async () => {
    // This is a response code from 42 Oauth2 server.
    if (route.query.code) {
        console.log(route.query.code)
        const redirect_uri = new URL("/auth", window.location as any)
        
        const response = await axios.post("http://localhost:3000/api/auth/login", {
            code: route.query.code,
            redirect_uri: redirect_uri.toString()
        })

        console.log("posted", response)

        store.commit("auth/connect", response.data.token)

        const me = await store.dispatch("me")

        console.log(me)
    }
})
</script>

<script lang="ts">
import { defineComponent } from "vue"
import LoginButton from "../../components/auth/login-button.vue"

export default defineComponent({
    components: {
        LoginButton
    }
})
</script>
