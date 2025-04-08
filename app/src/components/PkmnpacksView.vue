<template>
  <div class="app-container">
    <div v-for="(sets, generation) in generations" :key="generation" class="generation-section">
      <h2>{{ generation }}</h2>
      <div class="set-grid">
        <div v-for="set in sets" :key="set.id" class="set-card">
          <img :src="set.images.symbol" :alt="set.name" loading="lazy" />
          <p>{{ set.name }}</p>
          <button @click="openPack(set.id)">Open Pack</button>
        </div>
      </div>
    </div>

    <div v-if="pack.length" class="results">
      <h3>Your Pack</h3>
      <ul>
        <li v-for="card in pack" :key="card.id">
          <img :src="card.images.small" :alt="card.name" loading="lazy" />
          {{ card.name }} - <span class="rarity">{{ card.rarity }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const generations = ref({})
const pack = ref([])

async function fetchAllSets() {
  const response = await fetch('https://api.pokemontcg.io/v2/sets')
  const result = await response.json()
  const sets = result.data

  const genStructure = {}
  for (const set of sets) {
    const gen = getGenerationName(set)
    if (!genStructure[gen]) genStructure[gen] = []
    genStructure[gen].push(set)
  }
  generations.value = genStructure
}

function getGenerationName(set) {
  const id = set.id
  if (/base|jungle|fossil|teamrocket|base2|promo/i.test(id)) return 'Base'
  if (/gym/i.test(id)) return 'Gym'
  if (/southern/i.test(id)) return 'Southern Islands'
  if (/neo/i.test(id)) return 'Neo'
  if (/legendarycollection/i.test(id)) return 'Legendary Collection'
  if (/ecard|expedition|aquapolis|skyridge/i.test(id)) return 'E-Card'
  if (/ex|emerald|delta|holon|crystal|powerkeepers/i.test(id)) return 'Ruby and Sapphire'
  if (/pop/i.test(id)) return 'POP'
  if (/dp|platinum|rumble/i.test(id)) return 'Diamond and Pearl'
  if (/hgss|calloflegends/i.test(id)) return 'HeartGold & SoulSilver'
  if (
    /sv|151|paradox|paldea|obsidian|temporal|twilight|shrouded|stellar|surging|prismatic/i.test(id)
  )
    return 'Scarlet and Violet'
  if (
    /swsh|vivid|evolving|fusion|celebrations|chilling|rebel|darkness|shining|battle|go|brilliant|astral|lost|silver|crown/i.test(
      id,
    )
  )
    return 'Sword and Shield'
  if (
    /sm|detective|shining|burning|guardians|unbroken|teamup|dragon|celestial|forbidden|ultra|cosmic|hidden|unified|lostthunder/i.test(
      id,
    )
  )
    return 'Sun and Moon'
  if (
    /xy|kalos|evolutions|fates|generations|break|steam|roaring|primal|phantom|furious|flashfire/i.test(
      id,
    )
  )
    return 'XY'
  if (/bw|noble|next|emerging|dark|plasma|boundaries|dragonvault|legendarytreasures/i.test(id))
    return 'Black and White'
  if (/mcdonald/i.test(id)) return 'McDonald’s'
  return 'Others'
}

async function fetchCardsForSet(setId) {
  const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}`)
  const result = await response.json()
  return result.data || []
}

function categorizeCards(cards) {
  const categories = {
    common: [],
    uncommon: [],
    rare: [],
    rareHolo: [],
    unique: [],
  }

  for (const card of cards) {
    const rarity = card.rarity?.toLowerCase() || ''
    if (rarity.includes('common')) categories.common.push(card)
    else if (rarity.includes('uncommon')) categories.uncommon.push(card)
    else if (rarity.includes('rare holo')) categories.rareHolo.push(card)
    else if (rarity.includes('rare')) categories.rare.push(card)
    else categories.unique.push(card)
  }

  return categories
}

function getRandomCard(cards) {
  if (!cards.length) return null
  return cards[Math.floor(Math.random() * cards.length)]
}

async function openPack(setId) {
  if (!setId) return

  pack.value = []
  const cards = await fetchCardsForSet(setId)
  if (cards.length === 0) return

  const categorized = categorizeCards(cards)

  for (let i = 0; i < 3; i++) {
    const card = getRandomCard([...categorized.common, ...categorized.uncommon])
    if (card) pack.value.push(card)
  }

  const rareCard = getRandomCard(categorized.rare)
  if (rareCard) pack.value.push(rareCard)

  const rareHoloCard = getRandomCard(categorized.rareHolo)
  if (rareHoloCard) pack.value.push(rareHoloCard)

  const finalCard =
    Math.random() < 0.15 && categorized.unique.length
      ? getRandomCard(categorized.unique)
      : getRandomCard(categorized.rareHolo)
  if (finalCard) pack.value.push(finalCard)
}

fetchAllSets()
</script>

<style>
.app-container {
  padding: 20px;
  background-color: #1a1a1a;
  color: white;
  font-family: Arial, sans-serif;
}

.generation-section {
  margin-bottom: 40px;
}

.set-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.set-card {
  background: #2a2a2a;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  width: 180px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.set-card img {
  width: 100%;
  height: auto;
  margin-bottom: 8px;
}

.set-card button {
  background: orange;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.results {
  margin-top: 40px;
}

.results ul {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0;
  list-style: none;
}

.results li {
  background: #333;
  padding: 8px;
  border-radius: 6px;
  text-align: center;
  width: 150px;
}

.results img {
  width: 100%;
  height: auto;
  margin-bottom: 6px;
}

.rarity {
  font-style: italic;
  font-size: 0.9em;
  color: #ccc;
}
</style>
