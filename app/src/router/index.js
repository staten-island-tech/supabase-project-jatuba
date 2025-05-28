import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUp from '../views/SignUp.vue'
import UserLogin from '../views/UserLogin.vue'
import UserAuth from '../views/UserAuth.vue'
import PkmnPacksView from '@/views/PkmnPacksView.vue'
import SetView from '@/views/SetView.vue'
import MainView from '@/views/MainView.vue'
import MainStore from '@/views/MainStore.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/home', component: HomeView },
  { path: '/signup', component: SignUp },
  { path: '/login', component: UserLogin },
  { path: '/auth', component: UserAuth },
  { path: '/packs', name: 'Packs', component: PkmnPacksView },
  { path: '/set', name: 'Sets', component: SetView },
  { path: '/main', component: MainView },
  { path: '/store', component: MainStore },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
