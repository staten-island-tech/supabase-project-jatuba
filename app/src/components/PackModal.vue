<template>
  <div class="modal-overlay" ref="overlay">
    <div class="modal-content" ref="modal">
      <h3>Your Pack</h3>

      <div v-if="loading" class="loader-container">
        <div class="modal-spinner" />
      </div>

      <ul v-else class="modal-results">
        <li v-for="card in pack" :key="card.id" class="modal-card">
          <img :src="card.images.small" :alt="card.name" loading="lazy" />
          <p>{{ card.name }}</p>
          <span class="rarity">{{ card.rarity }}</span>
        </li>
      </ul>

      <div class="modal-actions">
        <button class="close-btn" @click="$emit('close')">Close</button>
        <button class="open-btn" @click="$emit('open-another')" :disabled="loading">
          <span v-if="loading">Opening...</span>
          <span v-else>Open Another</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import gsap from 'gsap'

defineProps({
  pack: Array,
  loading: Boolean,
})

const modal = ref(null)

onMounted(async () => {
  await nextTick()
  gsap.from(modal.value, {
    opacity: 0,
    y: -50,
    duration: 0.6,
    ease: 'power2.out',
  })
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
  width: auto;
  max-width: 90vw;
  max-height: 90vh;
  overflow: visible;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loader-container {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid orange;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.modal-results {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin: 20px 0;
  width: 100%;
  min-height: 180px;
  position: relative;
  overflow: visible;
}

.modal-card {
  background: #333;
  padding: 8px;
  border-radius: 6px;
  width: 150px;
  transition:
    transform 0.3s ease,
    z-index 0.3s;
  position: relative;
  z-index: 1;
}

.modal-card:hover {
  transform: scale(1.8);
  z-index: 10;
}

.modal-card img {
  width: 100%;
  margin-bottom: 6px;
  border-radius: 4px;
}

.modal-card p {
  margin: 4px 0;
  font-weight: bold;
}

.modal-card .rarity {
  font-size: 0.85rem;
  color: #aaa;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
}

.close-btn,
.open-btn {
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s;
}

.close-btn {
  background: orange;
  color: black;
}

.open-btn {
  background: #00b7ff;
  color: white;
}

.close-btn:hover,
.open-btn:hover {
  transform: scale(1.05);
}
</style>
