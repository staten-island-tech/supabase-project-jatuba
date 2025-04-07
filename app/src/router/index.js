import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserSignup from '../views/UserSignup.vue'
import UserLogin from '../views/UserLogin.vue'

const routes = [
  { path: '/', redirect: '/login' }, // default route
  { path: '/home', component: HomeView },
  { path: '/signup', component: UserSignup },
  { path: '/login', component: UserLogin },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
