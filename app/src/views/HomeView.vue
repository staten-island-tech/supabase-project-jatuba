<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()

onMounted(() => {
  userStore.fetchUser()
})
</script>

<template>
  <div v-if="userStore.profile">
    <h1>Welcome{{ userStore.profile.username }}!</h1>
  </div>
  <div v-else>
    <p>Loading your profile...</p>
  </div>
</template>
