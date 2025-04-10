import { ref } from 'vue'

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

export function usePokemonPacks() {
  const generations = ref({})
  const pack = ref([])
  const showModal = ref(false)

  async function fetchAllSets() {
    const response = await fetch('https://api.pokemontcg.io/v2/sets')
    const data = await response.json()
    const sets = data.data

    const grouped = {}
    for (const set of sets) {
      const gen = set.series || 'Others'
      if (!grouped[gen]) grouped[gen] = []
      grouped[gen].push(set)
    }

    generations.value = grouped
  }

  async function fetchCardsForSet(setId) {
    const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}`)
    const data = await response.json()
    return data.data || []
  }

  async function openPack(setId) {
    const cards = await fetchCardsForSet(setId)
    const categorized = categorizeCards(cards)
    const opened = []

    for (let i = 0; i < 5; i++) {
      const card = getRandomCard(categorized.common)
      if (card) opened.push(card)
    }

    for (let i = 0; i < 2; i++) {
      const card = getRandomCard(categorized.uncommon)
      if (card) opened.push(card)
    }

    const rareOrHolo = [...categorized.rare, ...categorized.rareHolo]
    const rareCard = getRandomCard(rareOrHolo)
    if (rareCard) opened.push(rareCard)

    const finalCard = categorized.unique.length
      ? getRandomCard(categorized.unique)
      : getRandomCard(rareOrHolo)

    if (finalCard) opened.push(finalCard)

    pack.value = opened
    showModal.value = true
  }

  return {
    generations,
    pack,
    showModal,
    fetchAllSets,
    openPack,
  }
}
