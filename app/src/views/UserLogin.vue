<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Log In</button>
    </form>
    <p class="errormsg" v-if="errorMsg">{{ errorMsg }}</p>

    <p>Don't have an account?</p>
    <button @click="goToSignUp">Sign Up</button>
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
        this.$router.push('/main') // or wherever you want to go after login
      }
    },
    goToSignUp() {
      this.$router.push('/signup')
    },
  },
}
</script>

<style>
h2 {
  font-family: 'Handjet', sans-serif;
  font-optical-sizing: auto;
  font-size: 55px;
}

input {
  font-size: 18px;
  margin-bottom: 32px;
  font-weight: bold;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-style: normal;
  height: 40px;
}

p {
  font-size: 18px;
  margin-bottom: 32px;
  font-weight: bold;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-style: normal;
}

form {
  justify-content: space-between;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px; /* Adds vertical spacing between children */
}

button {
  height: 40px;
}

.errormsg {
  color: red;
}
</style>
