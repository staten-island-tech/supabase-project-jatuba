<template>
  <div class="modal-overlay">
    <div class="modal-content" ref="modal">
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
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const modal = ref(null)
defineProps({
  pack: Array,
})

onMounted(() => {
  gsap.from(modal.value, {
    scale: 0.8,
    opacity: 0,
    duration: 0.4,
    ease: 'back.out(1.7)',
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
  overflow-y: auto;
  padding: 40px;
}

.modal-content {
  background-color: #222;
  color: white;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 1000px;
  text-align: center;
  position: relative;
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
  transition:
    transform 0.3s ease,
    z-index 0.3s ease;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.modal-results li:hover {
  transform: scale(2);
  z-index: 10;
}

.modal-results img {
  width: 100%;
  margin-bottom: 6px;
  border-radius: 4px;
  transition: transform 0.3s ease;
}

.modal-results p {
  font-weight: bold;
  margin: 4px 0;
}

.rarity {
  font-size: 0.85rem;
  color: orange;
}

.close-btn {
  background: orange;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}
.close-btn:hover {
  background-color: #ffae00;
  transform: scale(1.05);
}
</style>
