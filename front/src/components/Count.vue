<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function handleClick()
{
    count.value++;
}

</script>


<template>
    <p>
        Count : {{ count }}
        <p>
            <button @click="handleClick">Increment</button>
        </p>
    </p>

</template>