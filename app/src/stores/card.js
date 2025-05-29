import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useCardsStore = defineStore('cards', {
  state: () => ({
    collection: [],
  }),

  actions: {
    async fetchCollection() {
      const { data, error } = await supabase.from('user_cards').insert(
        [
          {
            user_id: currentUser.id,
            card_id: selectedCardId,
          },
        ],
        {
          onConflict: ['user_id', 'card_id'],
        },
      )

      if (error) {
        console.error('Insert error:', error)
      } else {
        console.log('Insert success:', data)
      }

      this.collection = data
    },

    async addCardToCollection(cardId, quantity = 1) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: existing } = await supabase
        .from('user_cards')
        .select('*')
        .eq('user_id', user.id)
        .eq('card_id', cardId)
        .maybeSingle()

      if (existing) {
        await supabase
          .from('user_cards')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('user_cards')
          .insert([{ user_id: 'some-id', card_id: 'some-card' }])
          .onConflict(['user_id', 'card_id'])
          .upsert()
      }

      await this.fetchCollection()
    },
  },
})
