// src/stores/user.js
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
      if (user) await this.fetchProfile(user.id)
    },
    async fetchProfile(userId) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

      if (!error) {
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
