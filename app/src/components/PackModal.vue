<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>Your Pack</h3>

      <div v-if="loading" class="modal-spinner-container">
        <div class="spinner"></div>
      </div>

      <ul v-else class="modal-results">
        <li v-for="card in pack" :key="card.id">
          <img :src="card.images.small" :alt="card.name" loading="lazy" />
          <p>{{ card.name }}</p>
          <span class="rarity">{{ card.rarity }}</span>
        </li>
      </ul>

      <div class="modal-actions">
        <button class="open-another" :disabled="loading" @click="$emit('open-another')">
          Open Another
        </button>
        <button class="close-btn" @click="$emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  pack: Array,
  loading: Boolean,
})

const emit = defineEmits(['close', 'open-another'])

onMounted(() => {
  document.body.classList.add('no-scroll')
})
onUnmounted(() => {
  document.body.classList.remove('no-scroll')
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  overflow-y: auto;
  padding: 40px;
}

.modal-content {
  background: #222;
  color: white;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 1000px;
  text-align: center;
  position: relative;
}

.modal-spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 5px solid #555;
  border-top-color: orange;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.modal-results {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 20px 0;
}
.modal-results li {
  background: #333;
  padding: 8px;
  border-radius: 6px;
  width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
  cursor: pointer;
  position: relative;
}
.modal-results li:hover {
  transform: scale(1.1);
  z-index: 10;
}
.modal-results img {
  width: 100%;
  margin-bottom: 6px;
  border-radius: 4px;
}
.modal-results p {
  font-weight: bold;
  margin: 4px 0;
}
.rarity {
  font-size: 0.85rem;
  color: orange;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}
.open-another {
  background: #ff9800;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  color: black;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}
.open-another:hover:not(:disabled) {
  background-color: #ffb300;
}
.open-another:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.close-btn {
  background: orange;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

body.no-scroll {
  overflow: hidden;
}
</style>
