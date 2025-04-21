<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>Your Pack</h3>
      <ul class="modal-results">
        <li v-for="card in pack" :key="card.id">
          <img :src="card.images.small" :alt="card.name" loading="lazy" />
          <p>{{ card.name }}</p>
          <span class="rarity">{{ card.rarity }}</span>
        </li>
      </ul>
      <button class="close-btn" @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  pack: Array,
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: #222;
  color: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  text-align: center;
}

.modal-results {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.modal-results li {
  background: #333;
  padding: 8px;
  border-radius: 6px;
  width: 150px;
}

.modal-results img {
  width: 100%;
  margin-bottom: 6px;
}

.close-btn {
  background: orange;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
