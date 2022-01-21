<template>
    <h1>Auth view</h1>

    <button @click="connect">Sign in</button>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useRoute } from "vue-router"
import axios from "axios"

const route = useRoute()

onMounted(async () => {
    // This is a response code from 42 Oauth2 server.
    if (route.query.code) {
        console.log(route.query.code)
        
        await axios.post("http://localhost:3000/api/auth/login_intra", { code: route.query.code })

        console.log("posted")

    }
})
</script>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
    methods: {
        connect() {
            const redirect_uri = new URL(this.$route.fullPath, window.location as any)
            const url = new URL("https://api.intra.42.fr/oauth/authorize");
            url.searchParams.set("client_id", import.meta.env.VITE_API42UID as string)
            url.searchParams.set("redirect_uri", redirect_uri.toString())
            url.searchParams.set("response_type", "code")

            window.location = url as any
        }
    }
})
</script>
