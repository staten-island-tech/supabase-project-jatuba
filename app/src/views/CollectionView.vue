<template>
  <div>
    <h1>Your Bag</h1>
    <div class="button-group">
      <button @click="$router.push('/main')">Back to Home</button>
      <button @click="logout">Logout</button>
    </div>

    <CollectionPage />
  </div>
</template>

<script setup>
import CollectionPage from '@/components/CollectionPage.vue'
</script>

<style scoped>
.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}
</style>
