<template>
  <div v-if="loading" class="global-loader">
    <div class="modal-spinner" />
  </div>

  <div class="app-container">
    <h1>BUY PACKS!</h1>
    
    <div v-if="userStore.profile" class="balance-display">
      <p>Your Balance: <span class="balance">{{ userStore.profile.credits }} credits</span></p>
    </div>

    <button @click="$router.push('/')">Back to Home</button>

    <div v-for="(sets, gen) in filteredGenerations" :key="gen" class="generation-section">
      <h2 class="generation-title">{{ gen }}</h2>
      <div class="set-grid">
        <StoreCard
          v-for="(set, index) in sets"
          :key="set.id"
          :set="set"
          :price="generationPrices[gen] || 20"
          :isOpening="openingSetId === set.id"
          @open="handleOpenPack(set.id, generationPrices[gen] || 20)"
        />
      </div>
    </div>

    <PackModal
      v-if="showModal"
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
import { useUserStore } from '@/stores/user'
import PackModal from '@/components/PackModal.vue'
import StoreCard from '@/components/StoreCard.vue'

const { generations, pack, showModal, loading, fetchAllSets, openPack } = usePokemonPacks()
const userStore = useUserStore()

const openingSetId = ref(null)
const lastOpenedSetId = ref(null)

const filteredGenerations = computed(() => {
  const result = {}
  for (const [key, value] of Object.entries(generations.value)) {
    if (key !== 'Other') result[key] = value
  }
  return result
})

onMounted(async () => {
  await fetchAllSets()
  await userStore.fetchUser()
  console.log("Loaded user profile:", userStore.profile)

})

async function handleOpenPack(setId, price) {
  if (openingSetId.value) return

  const canPurchase = await userStore.purchasePack(price)
  if (!canPurchase) {
    alert("You don't have enough credits to buy this pack.")
    return
  }

  openingSetId.value = setId
  lastOpenedSetId.value = setId

  openPack(setId).finally(() => {
    openingSetId.value = null
  })
}

async function handleOpenAnother() {
  if (openingSetId.value || !lastOpenedSetId.value) return

  const gen = pack.value?.series || ''
  const price = generationPrices[gen] || 20

  const canPurchase = await userStore.purchasePack(price)
  if (!canPurchase) {
    alert("You don't have enough credits to buy another pack.")
    return
  }

  openingSetId.value = lastOpenedSetId.value
  openPack(lastOpenedSetId.value).finally(() => {
    openingSetId.value = null
  })
}

const generationPrices = {
  Base: 500,
  Neo: 300,
  EX: 250,
  'Diamond & Pearl': 200,
  'Black & White': 150,
  XY: 100,
  'Sun & Moon': 25,
  'Sword & Shield': 10,
  'Scarlet & Violet': 10,
  'E-Card': 200,
  POP: 15,
  Platinum: 100,
  'HeartGold & SoulSilver': 100,
  Gym: 100,
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
  text-align: center;
  font-family: 'Handjet', sans-serif;
  font-optical-sizing: auto;
  font-size: 50px;
}

h1 {
  text-align: center;
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

.balance-display {
  margin: 16px 0;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.25rem;
}

.balance {
  color: orange;
  font-weight: bold;
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
