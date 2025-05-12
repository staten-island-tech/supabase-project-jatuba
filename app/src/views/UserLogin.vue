<!-- src/views/UserLogin.vue -->
<script>
import { supabase } from '../supabase'

export default {
  data() {
    return {
      email: '',
      password: '',
      username: '', // optional, if you want to update it after login
      errorMsg: '',
    }
  },
  methods: {
    async login() {
      const { data: sessionData, error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      })

      if (error) {
        this.errorMsg = 'Login failed: ' + error.message
        return
      }

      const user = sessionData.user

      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile) {
        const { error: insertError } = await supabase.from('profiles').insert([
          {
            id: user.id,
            username: this.username || 'New User', // fallback
          },
        ])

        if (insertError) {
          this.errorMsg = 'Error creating profile: ' + insertError.message
          return
        }
      }

      this.$router.push('/dashboard')
    },
  },
}
</script>


<template>
  <div>
    <h2>Login</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Login</button>

    <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>

    <!-- 👇 Sign Up Redirect -->
    <p>Don't have an account? <router-link to="/signup">Sign up</router-link></p>
  </div>
</template>
