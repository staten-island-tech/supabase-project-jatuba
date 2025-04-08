import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUp from '../views/SignUp.vue'
import UserLogin from '../views/UserLogin.vue'

const routes = [
  { path: '/', redirect: '/login' }, // default route
  { path: '/home', component: HomeView },
  { path: '/signup', component: SignUp },
  { path: '/login', component: UserLogin },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
