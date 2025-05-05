<template>
  <div class="app-container">
    <h1>Choose a Set</h1>

    <div v-if="loading" class="spinner"></div>

    <div v-for="(sets, gen) in generations" :key="gen" class="generation-section">
      <h2 class="generation-title">{{ gen }}</h2>
      <div class="set-grid">
        <SetCard
          v-for="(set, index) in sets"
          :key="set.id"
          :set="set"
          :index="index"
          @open="openPack(set.id)"
        />
      </div>
    </div>

    <PackModal v-if="showModal" :pack="pack" @close="showModal = false" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePokemonPacks } from '@/composables/usePokemonPacks'
import SetCard from '@/components/SetCard.vue'
import PackModal from '@/components/PackModal.vue'

const { generations, pack, showModal, loading, fetchAllSets, openPack } = usePokemonPacks()

onMounted(fetchAllSets)
</script>

<style>
.app-container {
  padding: 20px;
  background-color: #1a1a1a;
  color: white;
  font-family: Arial, sans-serif;
  text-align: center;
}

.generation-title {
  font-size: 24px;
  margin: 32px 0 16px;
  text-align: center;
}

.set-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  max-width: 720px;
  margin: 0 auto;
  gap: 16px;
}

.spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid orange;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 1s linear infinite;
  margin: 40px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
