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
        .select('card_id, quantity, cards(*)')
        .eq('user_id', user.id)

      if (error) {
        console.error('Fetch error:', error)
      } else {
        this.collection = data
      }
    },

    async addCardToCollection(cardId, quantity = 1) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        console.error('No user logged in')
        return
      }

      console.log('User ID:', user.id)
      console.log('Card ID:', cardId)

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
        const { data, error: insertError } = await supabase.from('user_cards').insert([
          {
            user_id: user.id,
            card_id: cardId,
            quantity,
          },
        ])

        if (insertError) {
          console.error('Insert error:', insertError)
        } else {
          console.log('Card inserted successfully', data)
        }
      }

      await this.fetchCollection()
    },
  },
})
