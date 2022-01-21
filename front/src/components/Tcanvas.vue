<script setup lang="ts">
import {ref} from 'vue';

interface Props {
    width: number;
    height: number;
}
const props = defineProps<Props>();

var g_ctx = document.getElementById("myCanvas")
var x = ref(0);
var y = ref(0);
var canvas;
var game;

const PLAYER_H = 100;
const PLAYER_w = 5;

function clear() {
    console.log('Cleared !');
    console.log(g_ctx);
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, props.width, props.height);
}

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

	// Draw players
	context.fillStyle = 'white';
	context.fillRect(0, game.player.y, PLAYER_w, PLAYER_H);
	context.fillRect(canvas.width - PLAYER_w, game.ai.y, PLAYER_w, PLAYER_H);

	// Draw ball
	context.beginPath();
	context.fillStyle = 'white';
	context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
	context.fill();
}
document.addEventListener('DOMContentLoaded', function () {
	console.log("ready!");
    canvas = document.getElementById('myCanvas');
	game = {
		player: {
			y: canvas.height / 2 - PLAYER_H / 2
		},
		ai: {
			y: canvas.height / 2 - PLAYER_H / 2
		},
		ball: {
			x: canvas.width / 2,
			y: canvas.height / 2,
			r: 5
		}
	}
    draw();
});

import Cbutton from "./Cbutton.vue";

</script>

<template>
    <span>{{x}}, {{y}}, {{height}}</span>
    <Cbutton v-on:click="clear">clear</Cbutton>
    <canvas id="myCanvas"  :width="width" :height="height"/>
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