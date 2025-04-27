<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const taskId = route.params.id
alert(taskId)
</script>

<template>

</template>

<style scoped>

</style>