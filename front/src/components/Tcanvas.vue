<script setup lang="ts">
import {ref} from 'vue';

interface Props {
    width: number;
    height: number;
}
const props = defineProps<Props>();

var g_ctx = document.getElementById("myCanvas")
console.log(document);
var x = ref(0);
var y = ref(0);
function showCoords(e) {
    x.value = e.offsetX;
    y.value = e.offsetY;
}

function drawLine(x1, x2, y1, y2) {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

// function draw(e) {
//     showCoords(e);
//     let c = document.getElementById("myCanvas");
//     let ctx = c.getContext("2d");
//     console.log(ctx);
//     // drawLine(ctx.x, ctx.y, e.offsetX, e.offsetY);
//     ctx.fillStyle = 'blue';
//     ctx.fillRect(x.value, y.value, 5, 5);
//     ctx.x = e.offsetX;
//     ctx.y = e.offsetY;
// }

function clear() {
    console.log('Cleared !');
    console.log(g_ctx);
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, props.width, props.height);
}

var canvas;
function draw() {
    var context = canvas.getContext('2d');
    // Draw field
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Draw middle line
    context.strokeStyle = 'white';
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();
}
document.addEventListener('DOMContentLoaded', function () {
	console.log("ready!");
    canvas = document.getElementById('myCanvas');
    draw();
});

import Cbutton from "./Cbutton.vue";

</script>

<template>
    <span>{{x}}, {{y}}, {{height}}</span>
    <Cbutton v-on:click="clear">clear</Cbutton>
    <canvas id="myCanvas"/>
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