<!-- src/views/UserSignup.vue -->
<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const username = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const router = useRouter()

const signUp = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  supabase.auth
    .signUp({
      email: email.value,
      password: password.value,
    })
    .then(({ data, error }) => {
      const userId = data.user?.id
      if (error) {
        errorMsg.value = error.message
        return
      }
      if (!userId) {
        errorMsg.value = 'Signup succeeded, but no user ID returned.'
      }
      insertUser(userId)
    })
}

const insertUser = async (userId) => {
  supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        username: username.value,
      },
    ])
    .then(({ error: profileError }) => {
      if (profileError) {
        errorMsg.value = profileError.message // <- small fix here too
        return
      }

      console.log('Profile inserted successfully')
      // You can do more actions here, like redirecting
    })
    .catch((err) => {
      console.error('Unexpected error inserting profile:', err.message)
    })

  successMsg.value = 'Account created! Redirecting...'
  setTimeout(() => router.push('/home'), 1500)
}
</script>

<template>
  <div>
    <h2>Sign Up</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="username" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="signUp">Sign Up</button>

    <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>
    <p v-if="successMsg" style="color: green">{{ successMsg }}</p>
  </div>
</template>
