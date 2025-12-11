import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/styles/variables.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化 auth store（在掛載前檢查 token）
import { useAuthStore } from './stores/auth'
import '@fortawesome/fontawesome-free/css/all.css'
const authStore = useAuthStore()
authStore.initialize()

app.mount('#app')
