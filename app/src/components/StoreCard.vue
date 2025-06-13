<template>
  <div class="set-card" ref="card">
    <div class="card-top">
      <img :src="set.images.symbol" :alt="set.name" loading="lazy" />
    </div>
    <div class="card-title">
      <p>{{ set.name }}</p>
    </div>
    <div class="card-bottom">
      <button class="open-button" :disabled="isOpening" @click="$emit('open', price)">
        <span v-if="isOpening">Opening...</span>
        <span v-else>BUY Pack</span>
      </button>
      <h3>PURCHASE A PACK</h3>
      <p class="cost">Price: ${{ price }}</p>
    </div>
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
  background-color: #2a2a2a;
  padding: 16px;
  border-radius: 8px;
  width: 220px;
  height: 370px;
  margin: 10px;
  text-align: center;
  opacity: 0;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.card-top {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-top img {
  max-height: 80px;
  max-width: 100%;
}

.card-title {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-title p {
  color: white;
  font-weight: 600;
  font-family: 'Rajdhani', sans-serif;
  margin: 0;
}

.card-bottom {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  padding-top: 1rem;
}

h3 {
  color: white;
  font-weight: 600;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  margin: 0;
}

.cost {
  color: orange;
  font-weight: 600;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.25rem;
  margin: 0;
}

.open-button {
  background-color: orange;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  color: black;
  width: 10rem;
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
