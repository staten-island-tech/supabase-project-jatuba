<template>
  <div>
    <h1>Pokemon Packs</h1>
    <PkmnpacksView />
    <button @click="$router.push('/')">Back to Home</button>
  </div>
</template>

<script setup>
import PkmnpacksView from '@/components/PkmnpacksView.vue'
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
