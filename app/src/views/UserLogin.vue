<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Log In</button>
    </form>

    <!-- Sign Up Button -->
    <p>Don't have an account?</p>
    <button @click="goToSignUp">Sign Up</button>

    <p v-if="errorMsg">{{ errorMsg }}</p>
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
    }
  },
  methods: {
    async login() {
      const { error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      })

      if (error) {
        this.errorMsg = 'Login failed: ' + error.message
      } else {
        this.$router.push('/') // or wherever you want to go after login
      }
    },
    goToSignUp() {
      this.$router.push('/signup') // This navigates to your SignUp.vue page
    },
  },
}
</script>
