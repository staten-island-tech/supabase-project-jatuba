<!-- src/views/UserLogin.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const router = useRouter()

const login = async () => {
  errorMsg.value = ''
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    errorMsg.value = error.message
    return
  }

  router.push('/home')
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
