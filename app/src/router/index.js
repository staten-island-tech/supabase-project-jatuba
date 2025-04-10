import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PkmnPacksView from '@/views/PkmnPacksView.vue'
import SetView from '@/views/SetView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/packs', name: 'Packs', component: PkmnPacksView },
  { path: '/set', name: 'Sets', component: SetView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
