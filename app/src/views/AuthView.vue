<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const signUp = async () => {
  const { user, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })
  if (error) {
    errorMessage.value = error.message
  } else {
    successMessage.value = 'Check your email for confirmation!'
  }
}

const signIn = async () => {
  const { user, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (error) {
    errorMessage.value = error.message
  } else {
    successMessage.value = 'Logged in successfully!'
  }
}
</script>

<template>
  <div>
    <h2>Sign Up / Login</h2>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="signUp">Sign Up</button>
    <button @click="signIn">Login</button>

    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
    <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
  </div>
</template>
