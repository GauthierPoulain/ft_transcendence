<script setup lang="ts">
import {ref} from 'vue';

var x = ref(0);
var y = ref(0);
function showCoords(e) {
    x.value = e.offsetX;
    y.value = e.offsetY;
}
</script>

<template>
    <span>{{x}}, {{y}}</span>
    <canvas id="myCanvas" @mousemove="showCoords"/>
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