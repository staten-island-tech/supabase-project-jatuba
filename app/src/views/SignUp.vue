<template>
  <div>
    <h2>Sign Up</h2>
    <form @submit.prevent="signUp">
      <input v-model="email" type="email" placeholder="Email" name="email" required />
      <input v-model="username" type="text" placeholder="Username" name="username" required />
      <input v-model="password" type="password" placeholder="Password" name="password" required />
      <button type="submit">Sign Up</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
  <button @click="goToLogIn">Go to Log In</button>
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
        password: this.password,
        options: {
          data: {
            username: this.username,
          },
        },
      })

      if (error) {
        this.message = error.message
        return
      }

      const user = data?.user

      if (user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: user.id,
          username: this.username,
          credits: 500,
        })
      }

      this.message = 'Sign Up Success! Return to log in page'
    },
    goToLogIn() {
      this.$router.push('/')
    },
  },
}
</script>
