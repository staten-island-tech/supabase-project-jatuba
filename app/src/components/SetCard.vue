<template>
  <div class="set-card" ref="card">
    <img :src="set.images.symbol" :alt="set.name" loading="lazy" />
    <p>{{ set.name }}</p>
    <button class="open-button" @click="$emit('open')">Open Pack</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const card = ref(null)
defineProps({ set: Object })

let scrollTween

onMounted(() => {
  const element = card.value

  scrollTween = ScrollTrigger.create({
    trigger: element,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      const rect = element.getBoundingClientRect()
      const centerY = window.innerHeight / 2
      const elementCenter = rect.top + rect.height / 2
      const distance = Math.abs(centerY - elementCenter)
      const maxDistance = window.innerHeight / 2

      const progress = Math.min(distance / maxDistance, 1)
      const eased = 1 - Math.pow(progress, 2) // quadratic easing toward center

      gsap.to(element, {
        scale: 0.85 + 0.15 * eased,
        opacity: 0.4 + 0.6 * eased,
        overwrite: 'auto',
        duration: 0.2,
        ease: 'power2.out',
      })
    },
  })
})

onUnmounted(() => {
  scrollTween.kill()
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

  will-change: transform, opacity;
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
  width: 70%;
  height: auto;
  margin-bottom: 10px;
}

p {
  color: white;
  font-weight: bold;
}
</style>
