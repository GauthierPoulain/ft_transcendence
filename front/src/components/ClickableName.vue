<script setup lang="ts">
	function logs(str) {
		console.log(str);
	}
</script>

<template>
	<p v-on:click="logs(`salut les gars`)">gapoulai</p>
</template>