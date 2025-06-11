import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useCardsStore = defineStore('cards', {
  state: () => ({
    collection: [],
  }),

  actions: {
    async fetchCollection() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('user_cards')
        .select('card_id, quantity')
        .eq('user_id', user.id)

      if (error) {
        console.error('Supabase fetch error:', error)
        return
      }

      if (!data || data.length === 0) {
        this.collection = []
        return
      }

      const cardIds = data.map(entry => `id:${entry.card_id}`).join(' OR ')
      try {
        const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(cardIds)}`)
        const cardData = await response.json()
        const apiCards = cardData.data

        const collectionWithDetails = data.map(entry => {
          const fullCard = apiCards.find(c => c.id === entry.card_id)
          console.log('🔍 Full Card:', fullCard)

          return {
            card_id: entry.card_id,
            quantity: entry.quantity,
            card: {
              name: fullCard?.name || 'Unknown',
              image: fullCard?.images?.large || '',
              generation: fullCard?.set?.series ?? fullCard?.set?.name ?? 'Other',
            }
          }
        })

        this.collection = collectionWithDetails
      } catch (e) {
        console.error('Failed to fetch card details from API:', e)
      }
    },

    async addCardToCollection(card, quantity = 1) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: existing, error: selectError } = await supabase
        .from('user_cards')
        .select('*')
        .eq('user_id', user.id)
        .eq('card_id', card.id)
        .maybeSingle()

      if (selectError) {
        console.error('Error checking existing card:', selectError)
        return
      }

      if (existing) {
        const { error: updateError } = await supabase
          .from('user_cards')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)

        if (updateError) console.error('Update error:', updateError)
      } else {
        const { error } = await supabase.from('user_cards').upsert(
          {
            user_id: user.id,
            card_id: card.id,
            quantity,
          },
          { onConflict: 'user_id,card_id' }
        )

        if (error) console.error('Insert error:', error)
      }

      await this.fetchCollection()
    },
  },
})
