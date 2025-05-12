<template>
  <div class="set-card" ref="card">
    <img :src="set.images.symbol" :alt="set.name" loading="lazy" />
    <p>{{ set.name }}</p>
    <button class="open-button" :disabled="isOpening" @click="$emit('open')">
      <span v-if="isOpening">Opening...</span>
      <span v-else>Open Pack</span>
    </button>
  </div>
</template>

<script setup>
defineProps({ set: Object, isOpening: Boolean })
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const card = ref(null)

let scrollTween

onMounted(() => {
  const element = card.value
  const img = element.querySelector('img')

  if (img.complete) {
    ScrollTrigger.refresh()
  } else {
    img.addEventListener('load', () => {
      ScrollTrigger.refresh()
    })
  }

  const quickOpacity = gsap.quickTo(element, 'opacity', {
    duration: 0.1,
    ease: 'power2.out',
    overwrite: true,
  })

  const quickScale = gsap.quickTo(element, 'scale', {
    duration: 0.1,
    ease: 'power2.out',
    overwrite: true,
  })

  scrollTween = ScrollTrigger.create({
    trigger: element,
    start: 'top 75%',
    end: 'bottom 25%',
    scrub: true,
    onUpdate: () => {
      const rect = element.getBoundingClientRect()
      const centerY = window.innerHeight / 2
      const elementCenter = rect.top + rect.height / 2
      const distance = Math.abs(centerY - elementCenter)
      const maxDistance = window.innerHeight / 2.5

      const progress = Math.min(distance / maxDistance, 1)
      const eased = 1 - Math.pow(progress, 2)

      const minOpacity = 0
      const minScale = 0.5
      const maxScale = 1.1

      const opacity = minOpacity + (1 - minOpacity) * eased
      const scale = minScale + (maxScale - minScale) * eased

      quickOpacity(opacity)
      quickScale(scale)
    },
  })
})

onUnmounted(() => {
  if (scrollTween) scrollTween.kill()
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
  will-change: transform, opacity;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
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
