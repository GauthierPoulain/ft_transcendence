<script setup lang="ts">
    interface Props {
        width: number;
        height: number;
    }
    const props = defineProps<Props>();
</script>

<template>
    <button class="style" :width="width" :height="height">
        <slot/>
    </button>
</template>

<style lang="scss">

@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap');

.style
{
    color: black;
    display: inline-block;
    margin: 0 2%;
    width: 250px;
    height: 50px;
    font-size: 32px;
    background-color: rgb(153, 153, 153);
    border-color: black;
    border-radius: 25px;
    border-width: 3px; //change value if border wanted
    border-style: solid;
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 900;
    align-items: center;
}

</style>