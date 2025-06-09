<template>
  <div class="collection-container">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="!collection.length" class="empty-message">No cards in your collection.</div>
    <div v-else class="card-grid">
      <div v-for="card in collection" :key="card.card_id" class="card-item">
        <img :src="card.card_image" :alt="card.card_name" loading="lazy" />
        <p class="card-name">{{ card.card_name }}</p>
        <span class="card-quantity">x{{ card.quantity }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCardsStore } from '../stores/card'

const cardsStore = useCardsStore()
const loading = ref(true)

onMounted(async () => {
  await cardsStore.fetchCollection()
  loading.value = false
})

const collection = cardsStore.collection
</script>

<style scoped>
.collection-container {
  padding: 1.5rem;
  text-align: center;
}

.loading {
  font-size: 1.2rem;
}

.empty-message {
  font-size: 1.1rem;
  color: #666;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.card-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem;
  background-color: #f8f8f8;
}

.card-item img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto 0.5rem;
}

.card-name {
  font-size: 0.9rem;
  font-weight: bold;
}

.card-quantity {
  font-size: 0.85rem;
  color: #444;
}
</style>
