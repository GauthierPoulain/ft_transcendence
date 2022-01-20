<script setup lang="ts">
import {ref} from 'vue';

interface Props {
    width: number;
    height: number;
}
const props = defineProps<Props>();

var x = ref(0);
var y = ref(0);
function showCoords(e) {
    x.value = e.offsetX;
    y.value = e.offsetY;
}

function drawLine(x1, x2, y1, y2) {
    let ctx = this.canvas;
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function draw(e) {
    showCoords(e);
    this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
    this.x = e.offsetX;
    this.y = e.offsetY;
}
</script>

<template>
    <span>{{x}}, {{y}}, {{height}}</span>
    <canvas id="myCanvas" :width="width" :height="height" @mousemove="draw"/>
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