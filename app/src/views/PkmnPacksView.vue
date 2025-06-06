<template>
  <div v-if="loading" class="global-loader">
    <div class="modal-spinner"></div>
  </div>

  <div class="app-container">
    <h1>Choose a Set</h1>
    <button @click="$router.push('/')">Back to Home</button>
    <button @click="logout">Logout</button>

    <div v-if="Object.keys(filteredGenerations).length">
      <div v-for="(sets, gen) in filteredGenerations" :key="gen" class="generation-section">
        <h2 class="generation-title">{{ gen }}</h2>
        <div class="set-grid">
          <SetCard
            v-for="set in sets"
            :key="set.id"
            :set="set"
            :isOpening="openingSetId === set.id"
            @open="handleOpenPack(set.id)"
          />
        </div>
      </div>
    </div>

    <p v-else class="no-sets">No sets available.</p>

    <PackModal
      v-if="showModal && pack.length"
      :pack="pack"
      :loading="loading"
      @close="showModal = false"
      @open-another="handleOpenAnother"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { usePokemonPacks } from '@/composables/usePokemonPacks'
import SetCard from '@/components/SetCard.vue'
import PackModal from '@/components/PackModal.vue'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()

onMounted(() => {
  userStore.fetchUser()
})

const { generations, pack, showModal, loading, fetchAllSets, openPack } = usePokemonPacks()

const openingSetId = ref(null)
const lastOpenedSetId = ref(null)

const filteredGenerations = computed(() => {
  const result = {}
  for (const [key, value] of Object.entries(generations.value)) {
    if (key !== 'Other') result[key] = value
  }
  return result
})

onMounted(fetchAllSets)

function handleOpenPack(setId) {
  if (openingSetId.value) return
  openingSetId.value = setId
  lastOpenedSetId.value = setId
  openPack(setId).finally(() => {
    openingSetId.value = null
  })
}

function handleOpenAnother() {
  if (openingSetId.value || !lastOpenedSetId.value) return
  openingSetId.value = lastOpenedSetId.value
  openPack(lastOpenedSetId.value).finally(() => {
    openingSetId.value = null
  })
}
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
  margin: 32px 0 16px;
  font-family: 'Handjet', sans-serif;
  font-optical-sizing: auto;
  font-size: 50px;
}

h1 {
  font-family: 'Handjet', sans-serif;
  font-optical-sizing: auto;
  font-size: 75px;
}

.set-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  max-width: 720px;
  margin: 0 auto;
  gap: 16px;
}

.global-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(20, 20, 20, 0.85);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
}

.modal-spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid orange;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-sets {
  margin-top: 40px;
  font-size: 24px;
  color: #ccc;
}
</style>
