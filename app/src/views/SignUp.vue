<template>
  <div>
    <h2>Sign Up</h2>
    <form @submit.prevent="signUp">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
  </div>
</template>

<script>
import { supabase } from '../supabase'

export default {
  data() {
    return {
      email: '',
      username: '',
      password: '',
    }
  },
  methods: {
    async signUp() {
      const { user, error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password,
      })

      if (error) {
        console.error('Error signing up:', error.message)
      } else {
        const { data, error: profileError } = await supabase.from('profiles')

        if (profileError) {
          console.error('Error creating profile:', profileError.message)
        } else {
          this.$router.push('/auth') // Redirect to profile page
        }
      }
    },
  },
}
</script>
