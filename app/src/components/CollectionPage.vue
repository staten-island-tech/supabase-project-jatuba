<template>
  <div class="collection-container">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else>
      <div class="filter">
        <label for="generation-select">Filter by Generation:</label>
        <select v-model="selectedGen" id="generation-select">
          <option value="">All</option>
          <option v-for="gen in generations" :key="gen" :value="gen">
            {{ gen }}
          </option>
        </select>
      </div>

      <div class="debug">
        <p><strong>Selected Gen:</strong> {{ selectedGen }}</p>
        <p><strong>Available Gens:</strong> {{ generations.join(', ') }}</p>
      </div>

      <div v-if="filteredCollection.length === 0" class="empty-message">
        No cards in this generation.
      </div>

      <div v-else class="card-grid">
        <div v-for="card in filteredCollection" :key="card.card_id" class="card-item">
          <img :src="card.card.image" :alt="card.card.name" loading="lazy" />
          <p class="card-name">{{ card.card.name }}</p>
          <p class="card-generation">{{ card.card.generation }}</p>
          <span class="card-quantity">x{{ card.quantity }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useCardsStore } from '@/stores/card'
import { storeToRefs } from 'pinia'

const cardsStore = useCardsStore()
const { collection } = storeToRefs(cardsStore)
const loading = ref(true)
const selectedGen = ref('')

const generations = computed(() => {
  const gens = new Set()
  collection.value.forEach((card) => {
    if (card.card.generation) gens.add(card.card.generation)
  })
  return Array.from(gens).sort()
})

const filteredCollection = computed(() => {
  if (!selectedGen.value) return collection.value
  return collection.value.filter((card) => card.card.generation === selectedGen.value)
})

onMounted(async () => {
  await cardsStore.fetchCollection()
  loading.value = false
})
</script>

<style scoped>
.collection-container {
  padding: 1.5rem;
  text-align: center;
}

.filter {
  margin-bottom: 1rem;
}

select {
  margin-left: 0.5rem;
  padding: 0.4rem;
  font-size: 1rem;
}

.loading {
  font-size: 1.2rem;
}

.empty-message {
  font-size: 1.1rem;
  color: #999;
}

.debug {
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 0.5rem;
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

.card-generation {
  font-size: 0.85rem;
  color: #555;
}

.card-quantity {
  font-size: 0.85rem;
  color: #444;
}
</style>
