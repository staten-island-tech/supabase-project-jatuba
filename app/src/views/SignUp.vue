<template>
  <div>
    <h2>Sign Up</h2>
    <form @submit.prevent="signUp">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
    <p v-if="message">{{ message }}</p>
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
      message: '',
    }
  },
  methods: {
    async signUp() {
      this.message = ''
      const { data, error } = await supabase.auth.signUp({
        email: this.email,
        username: this.username,
        password: this.password,
      })

      if (error) {
        this.message = error.message
        return
      }

      const user = data.user
      if (user) {
        await supabase.from('profiles').insert({
          id: user.id,
          username: this.username,
        })
      }

      this.message = 'Confirmation email sent! Please verify your email.'
    },
  },
}
</script>
