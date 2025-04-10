<template>
  <div class="set-card">
    <img :src="set.images.symbol" :alt="set.name" loading="lazy" />
    <p>{{ set.name }}</p>
    <button @click="$emit('open')">Open Pack</button>
  </div>
</template>

<script setup>
defineProps({
  set: Object,
})
</script>

<style scoped>
.set-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: #2a2a2a;
  padding: 16px;
  border-radius: 8px;
  width: 200px;
  height: auto;
  text-align: center;
  margin: 10px;
}

.set-icon {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.set-name {
  margin: 10px 0;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  text-align: center;
}

.open-button {
  background-color: orange;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  color: black;
  transition: background-color 0.2s;
}

.open-button:hover {
  background-color: #ffae00;
}

img {
  height: auto;
  width: 70%;
}
</style>
