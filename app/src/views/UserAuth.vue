<script setup>
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(async () => {
  const { error } = await supabase.auth.getSession()
  if (error) {
    console.error('Error checking session:', error)
  }

  const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(
    window.location.href,
  )

  if (sessionError) {
    console.error('Exchange error:', sessionError)
  } else {
    router.push('/home')
  }
})
</script>

<template>
  <div>
    <h2>Confirming...</h2>
    <p>Please wait while we complete your login.</p>
  </div>
</template>
