<template>
    <button @click="window.location = authorize_uri">Click to sign in</button>
</template>

<script setup lang="ts">
const redirect_uri = new URL("/auth", window.location as any)

const authorize_uri = new URL("https://api.intra.42.fr/oauth/authorize");
authorize_uri.searchParams.set("client_id", import.meta.env.VITE_API42UID as string)
authorize_uri.searchParams.set("redirect_uri", redirect_uri.toString())
authorize_uri.searchParams.set("response_type", "code")
</script>
