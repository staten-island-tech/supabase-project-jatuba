import { ref } from 'vue'
import { supabase } from '@/supabase'
import { useUserStore } from '@/stores/user'
import { useCardsStore } from '@/stores/card'

function categorizeCards(cards) {
  const categories = {
    common: [],
    uncommon: [],
    rare: [],
    rareHolo: [],
    ultraRare: [],
  }

  for (const card of cards) {
    const rarity = card.rarity?.toLowerCase() || ''

    if (
      rarity.includes('ultra rare') ||
      rarity.includes('secret') ||
      rarity.includes('illustration') ||
      rarity.includes('hyper') ||
      rarity.includes('special') ||
      rarity.includes('ace spec')
    ) {
      categories.ultraRare.push(card)
    } else if (rarity.includes('rare holo')) {
      categories.rareHolo.push(card)
    } else if (rarity.includes('rare')) {
      categories.rare.push(card)
    } else if (rarity.includes('uncommon')) {
      categories.uncommon.push(card)
    } else {
      categories.common.push(card)
    }
  }

  return categories
}

function getRandomCard(cards) {
  if (!cards.length) return null
  return cards[Math.floor(Math.random() * cards.length)]
}

function getWeightedRandomCard(primaryPool, secondaryPool, secondaryChance = 0.05) {
  const useSecondary = Math.random() < secondaryChance
  const pool = useSecondary && secondaryPool.length ? secondaryPool : primaryPool
  return getRandomCard(pool)
}

export function usePokemonPacks() {
  const generations = ref({})
  const pack = ref([])
  const showModal = ref(false)
  const loading = ref(false)

  async function fetchAllSets() {
    loading.value = true
    try {
      const response = await fetch('https://api.pokemontcg.io/v2/sets')
      const data = await response.json()
      const sets = data.data

      const normalizeSetName = (name) => {
        return name
          .replace(/\s+(Trainer Gallery|Galarian Gallery|Shiny Vault|Energies)$/i, '')
          .trim()
      }

      const grouped = {}

      for (const set of sets) {
        const gen = set.series || 'Others'
        const normalized = normalizeSetName(set.name)

        if (!grouped[gen]) grouped[gen] = []

        const existing = grouped[gen].find(s => s.normalizedName === normalized)

        if (existing) {
          existing.originalSetIds.push(set.id)
        } else {
          grouped[gen].push({
            id: set.id,
            name: normalized,
            images: set.images,
            normalizedName: normalized,
            originalSetIds: [set.id],
          })
        }
      }

      generations.value = grouped
    } catch (e) {
      console.error('Error fetching sets:', e)
    } finally {
      loading.value = false
    }
  }

  async function openPack(setId) {
    loading.value = true
    const usedIds = new Set()

    function getUniqueCard(pool) {
      const available = pool.filter((card) => !usedIds.has(card.id))
      const card = getRandomCard(available)
      if (card) usedIds.add(card.id)
      return card
    }

    try {
      const allSets = Object.values(generations.value).flat()
      const matching = allSets.find(s => s.id === setId || s.originalSetIds?.includes(setId))
      const setIdsToFetch = matching?.originalSetIds?.length ? matching.originalSetIds : [setId]

      const allCards = []
      for (const id of setIdsToFetch) {
        const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${id}`)
        const data = await response.json()
        allCards.push(...(data.data || []))
      }

      const categorized = categorizeCards(allCards)
      const opened = []

      for (let i = 0; i < 5; i++) {
        const card = getUniqueCard(categorized.common)
        if (card) opened.push(card)
      }

      for (let i = 0; i < 2; i++) {
        const card = getUniqueCard(categorized.uncommon)
        if (card) opened.push(card)
      }

      const rareOrHolo = [...categorized.rare, ...categorized.rareHolo]
      const rareCard = getUniqueCard(rareOrHolo)
      if (rareCard) opened.push(rareCard)

      const finalCard = getWeightedRandomCard(
        rareOrHolo.filter(card => !usedIds.has(card.id)),
        categorized.ultraRare.filter(card => !usedIds.has(card.id)),
        0.05,
      )
      if (finalCard) {
        usedIds.add(finalCard.id)
        opened.push(finalCard)
      }

      const userStore = useUserStore()
      await userStore.fetchUser()
      const userId = userStore.user?.id
      if (!userId) throw new Error('User not logged in')

      const cardsStore = useCardsStore()
      for (const card of opened) {
        await cardsStore.addCardToCollection(card, 1)
      }

      pack.value = opened
      showModal.value = true
    } catch (e) {
      console.error('Error opening pack:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    generations,
    pack,
    showModal,
    fetchAllSets,
    openPack,
    loading,
  }
}
