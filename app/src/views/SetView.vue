<template>
  <div>
    <h1>All Sets</h1>
    <PokemonSets />
    <button @click="$router.push('/')">Back to Home</button>
  </div>
</template>

<script setup>
import PokemonSets from '@/components/PokemonSets.vue'
</script>

<style scoped>
button {
  margin-top: 20px;
  padding: 10px;
  background: red;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
