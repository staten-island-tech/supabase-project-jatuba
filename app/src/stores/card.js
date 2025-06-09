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
        .select('card_id, quantity, cards(*), card_name, card_image')
        .eq('user_id', user.id)

      if (error) {
        console.error('Fetch error:', error)
      } else {
        this.collection = data
      }
    },

    async addCardToCollection(card, quantity = 1) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        console.error('No user logged in')
        return
      }

      const cardId = card.id

      const { data: existing, error: selectError } = await supabase
        .from('user_cards')
        .select('*')
        .eq('user_id', user.id)
        .eq('card_id', cardId)
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

        if (updateError) {
          console.error('Update error:', updateError)
        } else {
          console.log('Quantity updated successfully')
        }
      } else {
        const { data, error } = await supabase.from('user_cards').upsert(
          {
            user_id: user.id,
            card_id: cardId,
            quantity,
          },
          { onConflict: 'user_id,card_id' },
        )

        if (error) {
          console.error('Insert error:', error)
        } else {
          console.log('Card inserted successfully:', data)
        }
      }

      await this.fetchCollection()
    },
  },
})
