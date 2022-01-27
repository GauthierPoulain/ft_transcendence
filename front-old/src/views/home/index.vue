<script setup lang="ts">
import Cbutton from "../../components/Cbutton.vue";
import Tcanvas from "../../components/Tcanvas.vue";
import ClickableName from "../../components/ClickableName.vue";

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
        <Tcanvas v-bind:width="1000" v-bind:height="500"></Tcanvas>
    </div>
    <div>
        <Cbutton class="switch" v-on:click="swap()">switch</Cbutton>
        <clickable-name></clickable-name>
    </div>
</template>
