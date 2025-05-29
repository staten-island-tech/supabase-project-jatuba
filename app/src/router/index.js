import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUp from '../views/SignUp.vue'
import UserLogin from '../views/UserLogin.vue'
import UserAuth from '../views/UserAuth.vue'
import PkmnPacksView from '../views/PkmnPacksView.vue'
import MainView from '../views/MainView.vue'
import MainStore from '../views/MainStore.vue'
import { useUserStore } from '../stores/user'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/home', component: HomeView },
  { path: '/signup', component: SignUp },
  { path: '/login', component: UserLogin },
  { path: '/auth', component: UserAuth },
  { path: '/packs', name: 'Packs', component: PkmnPacksView },
  { path: '/main', component: MainView },
  { path: '/store', component: MainStore },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const protectedPaths = ['/packs', '/main', '/store']
let userFetched = false

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  if (!userFetched) {
    console.log('Fetching user from Supabase...')
    await userStore.fetchUser()
    userFetched = true
  }

  const isAuthenticated = !!userStore.user
  console.log('Authenticated:', isAuthenticated)

  if (protectedPaths.includes(to.path) && !isAuthenticated) {
    console.warn('Not authenticated, redirecting to /login')
    return next('/login')
  }

  next()
})

export default router
