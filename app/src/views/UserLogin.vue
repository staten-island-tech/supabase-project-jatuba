<!-- src/views/UserLogin.vue -->
<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

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
  </div>

  <div>
    <p>Don't have an account?</p>
    <RouterLink to="/signup">
      <button class="signup-button">Sign Up</button>
    </RouterLink>
  </div>
</template>

<style scoped>
.signup-button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.signup-button:hover {
  background-color: #2563eb;
}
</style>
