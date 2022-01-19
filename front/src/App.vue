<script setup lang="ts">

import Button from './components/Button.vue';
import Cbutton from './components/Cbutton.vue';

export default {
	components: {
		Cbutton
	},

	data () {
		return {
			isHidden: false
		}
	}
}

</script>

<template>
    <h1>FT_PONG</h1>
    <div class="button" v-if="!isHidden">
        <Cbutton v-on:click="print()">print</Cbutton>
        <Cbutton>button</Cbutton>
        <Cbutton>button</Cbutton>
    </div>
    <div>
        <Cbutton class="switch">switch</Cbutton>
    </div>
</template>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

h1
{
  color: white;
  text-align: center;
}

.button
{
  text-align: center;
}

body
{
  background: rgb(68, 68, 68);
}

</style>
