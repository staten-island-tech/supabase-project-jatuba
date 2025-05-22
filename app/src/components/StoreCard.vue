<template>
  <div class="set-card" ref="card">
    <img :src="set.images.symbol" :alt="set.name" loading="lazy" />
    <p>{{ set.name }}</p>
    <button class="open-button" :disabled="isOpening" @click="$emit('open')">
      <span v-if="isOpening">Opening...</span>
      <span v-else>BUY Pack</span>
    </button>
    <slot>
      <h3>PURCHASE A PACK</h3>
      <p class="cost">Price: ${{ price }}</p></slot
    >
  </div>
</template>

<script setup>
defineProps({ set: Object, isOpening: Boolean, price: Number })

import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const card = ref(null)
let scrollTween

onMounted(() => {
  const element = card.value
  const img = element.querySelector('img')

  if (!img.complete) {
    img.addEventListener('load', () => ScrollTrigger.refresh())
  }

  scrollTween = gsap.fromTo(
    element,
    { opacity: 0 },
    {
      opacity: 1,
      ease: 'power2.out',
      duration: 0.5,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true,
      },
    },
  )
})

onUnmounted(() => {
  scrollTween?.scrollTrigger?.kill()
  scrollTween?.kill()
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
  width: 220px;
  text-align: center;
  margin: 10px;
  gap: 1rem;
  opacity: 0;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.set-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(255, 165, 0, 0.6);
}

img {
  width: 70%;
  height: auto;
  margin-bottom: 10px;
}

p {
  color: white;
  font-weight: bold;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-style: normal;
}

h3 {
  color: white;
  font-weight: bold;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-style: normal;
  font-size: 1rem;
}

span {
  font-weight: bold;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-style: normal;
}

.cost {
  color: orange;
  font-weight: bold;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-style: normal;
  font-size: 1.25rem;
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
</style>
