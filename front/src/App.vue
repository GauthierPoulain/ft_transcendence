<script setup lang="ts">
import Button from "./components/Button.vue";
import Cbutton from "./components/Cbutton.vue";
import Tcanvas from "./components/Tcanvas.vue";

import { ref } from "vue";

var isHidden = ref(false);

function swap() {
    isHidden.value = !isHidden.value;
}

function print() {
    console.log(isHidden.value);
}
</script>

<template>
    <h1>FT_PONG</h1>
    <div class="button" v-show="!isHidden">
        <Cbutton v-on:click="print()">print</Cbutton>
        <Cbutton>Leaderboard</Cbutton>
        <Cbutton>Friend List</Cbutton>
        <Tcanvas v-bind:width="800" v-bind:height="380"></Tcanvas>
    </div>
    <div>
        <Cbutton class="switch" v-on:click="swap()">switch</Cbutton>
    </div>
</template>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
}

h1 {
    color: white;
    text-align: center;
    padding: 20px;
    margin: 20px;
    margin-left: 70vh;
    margin-right: 70vh;
    border-radius: 25px;
    background: rgb(105, 105, 105);
}

.button {
    text-align: center;
}

body {
    background: rgb(68, 68, 68);
}
</style>
