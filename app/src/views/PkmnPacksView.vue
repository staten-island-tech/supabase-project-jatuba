<template>
  <div class="app-container">
    <div v-if="loading" class="spinner-container">
      <div class="spinner"></div>
    </div>

    <div v-else>
      <h1>Choose a Set</h1>

      <div v-for="(sets, gen) in generations" :key="gen" class="generation-section">
        <h2 class="generation-title">{{ gen }}</h2>
        <div class="set-grid">
          <SetCard v-for="set in sets" :key="set.id" :set="set" @open="openPack(set.id)" />
        </div>
      </div>
    </div>

    <Transition name="fade">
      <PackModal v-if="showModal" :pack="pack" @close="showModal = false" />
    </Transition>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePokemonPacks } from '@/composables/usePokemonPacks'
import SetCard from '@/components/SetCard.vue'
import PackModal from '@/components/PackModal.vue'

const { generations, pack, showModal, fetchAllSets, openPack, loading } = usePokemonPacks()

onMounted(fetchAllSets)
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #1a1a1a;
  color: white;
  font-family: Arial, sans-serif;
  text-align: center;
  min-height: 100vh;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid #ccc;
  border-top-color: orange;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
