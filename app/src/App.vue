<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <h1>POKEMON-PACK-OPENER</h1>
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
  color: black;
  text-align: center;
}
</style>
