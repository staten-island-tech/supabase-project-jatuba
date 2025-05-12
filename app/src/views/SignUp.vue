<template>
  <div>
    <h2>Sign Up</h2>
    <form @submit.prevent="signUp">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
    <p v-if="errorMsg">{{ errorMsg }}</p>
    <p v-if="infoMsg">{{ infoMsg }}</p>
  </div>
</template>

<script>
import { supabase } from '../supabase'

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMsg: '',
      infoMsg: '',
    }
  },
  methods: {
    async signUp() {
      this.errorMsg = ''
      this.infoMsg = ''

      const { error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password,
      })

      if (error) {
        this.errorMsg = 'Error signing up: ' + error.message
      } else {
        this.infoMsg = 'Check your email to confirm your account.'
      }
    },
  },
}
</script>
