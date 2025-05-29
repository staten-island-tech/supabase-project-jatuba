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
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error || !session || !session.user) {
        console.error('❌ Failed to get session:', error)
        return
      }

      this.user = session.user
      await this.createProfileIfNotExists(session.user.id)
    },

    async createProfileIfNotExists(userId) {
      const { data: profileData, error: selectError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (selectError) {
        console.warn('🆕 No profile found, creating one for user:', userId)

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: userId, credits: 750 }])
          .select()
          .single()

        if (insertError) {
          console.error('❌ Failed to create profile:', insertError)
          return
        }

        this.profile = newProfile
        console.log('✅ Created new profile:', newProfile)
        return
      }

      this.profile = profileData
      console.log('✅ Loaded existing profile:', profileData)
    },

    async updateCredits(amount) {
      if (!this.user || !this.profile) return false

      const current = this.profile.credits || 0
      const newCredits = current + amount

      if (newCredits < 0) {
        console.warn('⚠️ Not enough credits to complete this transaction.')
        return false
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', this.user.id)
        .select()
        .single()

      if (!error) {
        this.profile.credits = data.credits
        console.log(`💰 Updated credits: ${data.credits}`)
        return true
      }

      console.error('❌ Failed to update credits:', error)
      return false
    },

    async purchasePack(price) {
      return await this.updateCredits(-Math.abs(price))
    },

    async signOut() {
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
      console.log('👋 Signed out.')
    },
  },
})
