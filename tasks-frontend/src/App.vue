<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
</script>

<template>
  <header>
    <div class="wrapper">
      <Navbar/>
    </div>
  </header>

  <RouterView />
</template>
