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
        // After sign-up, create the profile in the database with username
        const { data, error: profileError } = await supabase
          .from('profiles')
          .insert([{ user_id: user.id, username: this.username }])

        if (profileError) {
          console.error('Error creating profile:', profileError.message)
        } else {
          this.$router.push('/profile') // Redirect to profile page
        }
      }
    },
  },
}
</script>
