<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="header">
    <h1>POKEMON-PACK-OPENER</h1>
  </div>
  <router-view />
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  gap: 5rem;
}

h1 {
  font-family: 'Handjet', sans-serif;
  font-optical-sizing: auto;
  font-size: 85px;
  color: orange;
  margin: 0;
}
</style>
