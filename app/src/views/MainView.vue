<template>
  <div class="home-container">
    <h1>Welcome to the Pokémon Pack Opener</h1>
    <p>Open booster packs and discover cards from all generations!</p>

    <div class="button-group">
      <router-link to="/packs">
        <button>Start Opening Packs</button>
      </router-link>

      <router-link to="/store">
        <button>Visit the Store</button>
      </router-link>

      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()

function logout() {
  userStore.signOut()
}

onMounted(() => {
  userStore.fetchUser()
})
</script>

<style>
.home-container {
  padding: 40px;
  text-align: center;
  color: white;
  background-color: #1a1a1a;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  font-size: 36px;
  margin-bottom: 20px;
}

p {
  font-size: 18px;
  margin-bottom: 32px;
  font-weight: bold;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-style: normal;
}

button {
  font-size: 16px;
  padding: 12px 24px;
  background-color: orange;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-style: normal;
  row-gap: 2rem;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}
</style>
