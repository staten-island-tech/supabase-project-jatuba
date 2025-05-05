<template>
  <div class="set-card" ref="card">
    <img :src="set.images.symbol" :alt="set.name" loading="lazy" />
    <p>{{ set.name }}</p>
    <button class="open-button" @click="$emit('open')">Open Pack</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const card = ref(null)
defineProps({ set: Object })

let st
onMounted(async () => {
  await nextTick()

  gsap.set(card.value, { opacity: 0, y: 50 })

  st = ScrollTrigger.create({
    trigger: card.value,
    start: 'top 90%',
    end: 'bottom 10%',

    onEnter: () =>
      gsap.to(card.value, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.15,
      }),

    onLeave: () =>
      gsap.to(card.value, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: 'power2.in',
      }),

    onEnterBack: () =>
      gsap.to(card.value, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.15,
      }),

    onLeaveBack: () =>
      gsap.to(card.value, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: 'power2.in',
      }),
  })
})

onUnmounted(() => {
  st && st.kill()
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
