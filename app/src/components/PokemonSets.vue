<template>
  <div id="app">
    <h2>Pokemon TCG Set Rarities</h2>
    <table border="1">
      <thead>
        <tr>
          <th>Set Name</th>
          <th>Rarities</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="set in sets" :key="set.id">
          <td>{{ set.name }}</td>
          <td>{{ set.rarities.length ? set.rarities.join(', ') : 'No data' }}</td>
        </tr>
      </tbody>
    </table>
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
const POSSIBLE_RARITIES = [
  'Amazing Rare',
  'Common',
  'LEGEND',
  'Promo',
  'Rare',
  'Rare ACE',
  'Rare BREAK',
  'Rare Holo',
  'Rare Holo EX',
  'Rare Holo GX',
  'Rare Holo LV.X',
  'Rare Holo Star',
  'Rare Holo V',
  'Rare Holo VMAX',
  'Rare Prime',
  'Rare Prism Star',
  'Rare Rainbow',
  'Rare Secret',
  'Rare Shining',
  'Rare Shiny',
  'Rare Shiny GX',
  'Rare Ultra',
  'Uncommon',
]

const sets = ref([])
const skippedSets = ref([])

async function fetchSets() {
  try {
    const response = await fetch(API_URL, {
      headers: { 'X-Api-Key': API_KEY },
    })

    if (!response.ok) {
      console.error('Error: API failed to fetch sets.')
      return []
    }

    const data = await response.json()
    console.log(
      'Fetched sets:',
      data.data.map((set) => set.name),
    )
    return data.data
  } catch (error) {
    console.error('Error fetching sets:', error)
    return []
  }
}

async function fetchCardRaritiesForSet(setId, retries = 3) {
  try {
    console.log(`Fetching cards for set: ${setId}`)
    const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}`, {
      headers: { 'X-Api-Key': API_KEY },
    })

    if (!response.ok) {
      console.error(`Error: API response failed for set ${setId}`)
      return []
    }

    const data = await response.json()
    console.log(`API Response for ${setId}:`, data)

    if (!data.data || data.data.length === 0) {
      console.warn(`Warning: No cards found for set ${setId}`)

      if (retries > 0) {
        console.log(`Retrying set ${setId} (${retries} attempts left)...`)
        return fetchCardRaritiesForSet(setId, retries - 1)
      }

      skippedSets.value.push(setId)
      return []
    }

    let rarities = new Set()
    data.data.forEach((card) => {
      if (POSSIBLE_RARITIES.includes(card.rarity)) {
        rarities.add(card.rarity)
      }
    })

    return Array.from(rarities)
  } catch (error) {
    console.error(`Error fetching rarities for set ${setId}:`, error)
    return []
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function processSets() {
  const fetchedSets = await fetchSets()

  for (const set of fetchedSets) {
    console.log(`Fetching rarities for: ${set.name}`)
    set.rarities = await fetchCardRaritiesForSet(set.id)

    if (!set.rarities.length) {
      console.warn(`No rarities found for ${set.name} (possible API issue).`)
    }

    sets.value.push(set)
    await delay(750)
  }
}

onMounted(processSets)
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #e0e0e0;
}

h2 {
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 20px;
  background-color: #444;
  padding: 10px 20px;
  border-radius: 8px;
}

table {
  width: 80%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
  color: #f0f0f0;
}

th {
  background-color: #666;
  color: #ffffff;
}

h3 {
  margin-top: 30px;
  color: #ff6f61;
}

ul {
  list-style-type: none;
  padding: 0;
  color: #cccccc;
}

button,
.red-button {
  background-color: #e53935;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 15px;
}
</style>
