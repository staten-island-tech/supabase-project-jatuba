<template>
  <div class="container">
    <h1>Pokemon Digi TCG</h1>
    <div class="button-container">
      <router-link to="/set">
        <button>View All Sets</button>
      </router-link>

      <router-link to="/pack">
        <button>View All Packs</button>
      </router-link>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  display: flex;
  flex-direction: column;
}

h1 {
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  background-color: blue;
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: darkblue;
}

h2 {
  margin-bottom: 20px;
}

.container {
  display: flex;
  flex-direction: column;

  height: auto;
  width: 80vw;

  align-items: center;
  justify-content: center;
  text-align: center;

  padding: 20px;
  margin: 0 auto;
}

.button-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
}
</style>
