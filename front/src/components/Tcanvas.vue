<script setup lang="ts">
import { ref } from "vue";

interface Props {
    width: number;
    height: number;
}
const props = defineProps<Props>();
console.log(props);

var x = ref(0);
var y = ref(0);
function showCoords(e: any) {
    x.value = e.offsetX;
    y.value = e.offsetY;
}
</script>

<template>
    <span>{{ x }}, {{ y }}</span>
    <canvas
        id="myCanvas"
        @mousemove="showCoords"
        :width="props.width"
        :height="props.height"
    />
</template>

<style>
#myCanvas {
    border: 1px solid grey;
    padding-left: 0;
    padding-right: 0;
    margin-left: auto;
    margin-right: auto;
    display: block;
}
</style>
