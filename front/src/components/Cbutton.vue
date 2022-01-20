<script setup lang="ts">

</script>

<template>
    <div class="style">
        <button>
            <slot/>
        </button>
    </div>
</template>

<style lang="scss">

@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap');

.style
{
    color: white;
    display: inline-block;
    margin: 0 2%;

    button
    {
        width: 250px;
        height: 50px;
        font-size: 32px;
        background-color: rgb(73, 73, 73);
        border-color: rgb(117, 117, 117);
        border-radius: 25px;
        border-width: 3px; //change value if border wanted
        border-style: solid;
        font-family: 'Josefin Sans', sans-serif;
        color: rgb(212, 212, 212);
        font-weight: 900;
        text-align: center;
        
        transition: 0.5s;
    }
}

button:hover
{
    background-color: rgb(212, 212, 212);
    color: rgb(73, 73, 73);
    transition: 0.5s;
}

</style>