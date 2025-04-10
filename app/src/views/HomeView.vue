<template>
  <div class="home-container">
    <h1>Welcome to the Pokémon Pack Opener</h1>
    <p>Open booster packs and discover cards from all generations!</p>

    <router-link to="/packs">
      <button>Start Opening Packs</button>
    </router-link>

    <router-link to="/set">
      <button>View All Sets</button>
    </router-link>
  </div>
</template>

<script setup></script>

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
}

button {
  font-size: 16px;
  padding: 12px 24px;
  background-color: orange;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
