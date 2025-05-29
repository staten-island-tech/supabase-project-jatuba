<script setup>
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

function logout() {
  userStore.signOut()
}
</script>

<template>
  <div class="header">
    <h1>POKEMON-PACK-OPENER</h1>
    <button @click="logout">Logout</button>
  </div>
  <router-view />
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  gap: 5rem; 
}

h1 {
  font-family: 'Handjet', sans-serif;
  font-optical-sizing: auto;
  font-size: 85px;
  color: orange;
  margin: 0;
}

button {
  padding: 0.5rem 1rem;
  font-weight: bold;
  background-color: orange;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}


.logout {
  background-color: orange;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  color: black;
  font-family: 'Handjet', sans-serif;
}
</style>




