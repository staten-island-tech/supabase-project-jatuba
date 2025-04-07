<template>
  <div>
    <h2>Pokemon TCG Set Rarities</h2>

    <div class="selector">
      <label for="setSelector">Choose a Set:</label>
      <select v-model="selectedSet" id="setSelector">
        <option v-for="set in sets" :key="set.id" :value="set.id">
          {{ set.name }}
        </option>
      </select>
      <button @click="openPack">Open Pack</button>
    </div>

    <div v-if="pack.length" class="results">
      <h3>Your Pack</h3>
      <div class="card-list">
        <div v-for="card in pack" :key="card.id" class="card-item">
          <img :src="card.images.small" :alt="card.name" />
          <div class="card-info">
            <strong>{{ card.name }}</strong>
            <span class="rarity">{{ card.rarity }}</span>
          </div>
        </div>
      </div>
    </div>

    <h3>Skipped Sets</h3>
    <ul>
      <li v-for="set in skippedSets" :key="set">{{ set }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API_URL = 'https://api.pokemontcg.io/v2/sets'
const API_KEY = 'f4eb1886-496f-4234-b480-cefe29296242'

const sets = ref([])
const skippedSets = ref([])
const selectedSet = ref('')
const pack = ref([])
const setRarities = ref({})

async function fetchSets() {
  try {
    const response = await fetch(API_URL, {
      headers: { 'X-Api-Key': API_KEY },
    })
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching sets:', error)
    return []
  }
}

async function fetchCardsForSet(setId, retries = 3) {
  try {
    const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}`, {
      headers: { 'X-Api-Key': API_KEY },
    })

    if (!response.ok) {
      console.error(`API response failed for set ${setId}`)
      return []
    }

    const data = await response.json()
    if (!data.data || data.data.length === 0) {
      if (retries > 0) {
        console.log(`Retrying set ${setId} (${retries} attempts left)...`)
        return fetchCardsForSet(setId, retries - 1)
      }
      skippedSets.value.push(setId)
      return []
    }

    return data.data
  } catch (error) {
    console.error(`Error fetching cards for set ${setId}:`, error)
    return []
  }
}

async function fetchRarities() {
  const fetchedSets = await fetchSets()
  for (const set of fetchedSets) {
    const cards = await fetchCardsForSet(set.id)
    const rarities = [...new Set(cards.map((card) => card.rarity).filter((r) => r))]

    setRarities.value[set.id] = rarities
    sets.value.push(set)

    await delay(750)
  }
}

function getRandomCard(cards) {
  return cards.length ? cards[Math.floor(Math.random() * cards.length)] : null
}

function categorizeCards(cards, rarities) {
  let categories = {
    common: [],
    uncommon: [],
    rare: [],
    rareHolo: [],
    unique: [],
  }

  cards.forEach((card) => {
    if (card.rarity === 'Common') categories.common.push(card)
    else if (card.rarity === 'Uncommon') categories.uncommon.push(card)
    else if (card.rarity === 'Rare') categories.rare.push(card)
    else if (card.rarity === 'Rare Holo') categories.rareHolo.push(card)
    else if (
      rarities.includes(card.rarity) &&
      !['Rare', 'Rare Holo', 'Common', 'Uncommon'].includes(card.rarity)
    ) {
      categories.unique.push(card)
    }
  })

  return categories
}

async function openPack() {
  if (!selectedSet.value) return

  pack.value = []
  const cards = await fetchCardsForSet(selectedSet.value)
  if (cards.length === 0) return

  const rarities = setRarities.value[selectedSet.value] || []
  const categorized = categorizeCards(cards, rarities)

  for (let i = 0; i < 3; i++) {
    let card = getRandomCard([...categorized.common, ...categorized.uncommon])
    if (card) pack.value.push(card)
  }

  let rareCard = getRandomCard(categorized.rare)
  if (rareCard) pack.value.push(rareCard)

  let rareHoloCard = getRandomCard(categorized.rareHolo)
  if (rareHoloCard) pack.value.push(rareHoloCard)

  let finalCard
  if (Math.random() < 0.15 && categorized.unique.length) {
    finalCard = getRandomCard(categorized.unique)
  } else {
    finalCard = getRandomCard(categorized.rareHolo)
  }
  if (finalCard) pack.value.push(finalCard)
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

onMounted(fetchRarities)
</script>

<style scoped>
h2,
h3 {
  text-align: center;
  color: #ffffff;
  margin-top: 1rem;
}

body {
  background-color: #121212;
}

.selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
}

select,
button {
  padding: 8px;
  font-size: 1rem;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.card-item {
  background: #333;
  border-radius: 10px;
  padding: 0.5rem;
  text-align: center;
  width: 120px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.card-item:hover {
  transform: scale(1.05);
}

.card-item img {
  width: 100%;
  border-radius: 8px;
}

.card-info {
  margin-top: 0.5rem;
}

.card-info .rarity {
  display: block;
  font-size: 0.9rem;
  color: #ffa07a;
}

ul {
  list-style-type: none;
  padding: 0;
  color: #ddd;
  text-align: center;
}
</style>
