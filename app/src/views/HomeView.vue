<!-- src/views/HomeView.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const username = ref('')
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    errorMsg.value = 'User not logged in.'
    loading.value = false
    return
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  if (profileError) {
    errorMsg.value = profileError.message
  } else {
    username.value = profile.username
  }

  loading.value = false
})
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="errorMsg">Error: {{ errorMsg }}</div>
  <div v-else>
    <h2>Welcome, {{ username }}!</h2>
  </div>
</template>
