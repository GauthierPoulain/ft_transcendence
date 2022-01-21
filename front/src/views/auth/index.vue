<template>
    <h1>Auth view</h1>

    <div v-if="state == 0">
        <login-button />
    </div>

    <div v-if="state == 1">
        <p>Code in url, api token will be {{ apiToken }}</p>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import axios from "axios"

const route = useRoute()

const state = ref(0)
const apiToken = ref("")

if (route.query.code) {
    state.value = 1
}

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

        apiToken.value = response.data.token

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
