import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    profile: null,
  }),

  actions: {
    async fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      this.user = user
      if (user) await this.createProfileIfNotExists(user.id)
    },

    async createProfileIfNotExists(userId) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

      if (error) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: userId, credits: 750 }])
          .select()
          .single()

        if (!insertError) {
          this.profile = newProfile
        }
      } else {
        this.profile = data
      }
    },

    async signOut() {
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
    },
  },
})
