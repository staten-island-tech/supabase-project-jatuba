<template>
  <div class="set-card" ref="card">
    <img :src="set.images.symbol" :alt="set.name" loading="lazy" />
    <p>{{ set.name }}</p>
    <button class="open-button" @click="$emit('open')">Open Pack</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const card = ref(null)

onMounted(() => {
  gsap.fromTo(
    card.value,
    {
      opacity: 0,
      y: 50,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card.value,
        start: 'top 90%',
        end: 'bottom 10%',
        toggleActions: 'play reverse play reverse',
        markers: false,
      },
    },
  )
})

defineProps({
  set: Object,
})
</script>

<style scoped>
.set-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: #2a2a2a;
  padding: 16px;
  border-radius: 8px;
  width: 200px;
  text-align: center;
  margin: 10px;
}

.open-button {
  background-color: orange;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  color: black;
  transition:
    background-color 0.2s,
    transform 0.2s;
}

.open-button:hover {
  background-color: #ffae00;
  transform: scale(1.05);
}

.open-button:active {
  transform: scale(0.95);
}

img {
  height: auto;
  width: 70%;
  margin-bottom: 10px;
}

p {
  color: white;
  font-weight: bold;
}
</style>
