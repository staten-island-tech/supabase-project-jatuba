import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { supabase } from './supabase'
import { useUserStore } from './stores/user'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')

const userStore = useUserStore()
userStore.fetchUser()

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    userStore.user = null
    userStore.profile = null
    console.log('Signed out.')
    router.push('/login')
  }

  if (event === 'SIGNED_IN') {
    userStore.fetchUser()
    console.log('Signed in.')
  }
})
