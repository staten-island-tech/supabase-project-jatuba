import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PkmnpacksView from '@/components/PkmnpacksView.vue'
import SetView from '@/views/SetView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/set', component: SetView },
  { path: '/pack', component: PkmnpacksView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
