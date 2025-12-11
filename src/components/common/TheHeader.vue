<template>
  <header class="header">
    <router-link to="/" class="header__logo">圖書館系統</router-link>
    
    <div class="header__search">
      <form @submit.prevent="handleSearch">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜尋書名、作者、ISBN..."
          @keyup.enter="handleSearch"
        />
      </form>
    </div>
    
    <div class="header__actions">
      <template v-if="isAuthenticated">
        <NotificationBell />
        <router-link to="/my" class="user-profile">
          <i class="fa-regular fa-user"></i>
          {{ user?.name || '會員中心' }}
        </router-link>
        <button @click="handleLogout" class="logout-btn">
          <i class="fa-solid fa-right-from-bracket"></i>
          登出
        </button>
      </template>
      <template v-else>
        <button @click="handleLogin" class="login-btn">
          <i class="fa-solid fa-right-to-bracket"></i>
          登入
        </button>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import NotificationBell from './NotificationBell.vue'

const router = useRouter()
const authStore = useAuthStore()

const searchQuery = ref('')

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { keyword: searchQuery.value }
    })
  }
}

const handleLogin = () => {
  router.push('/login')
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/')
  } catch (error) {
    console.error('登出失敗:', error)
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: 80px;
  background: #fff;
  border-bottom: 2px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header__logo {
  font-family: 'Noto Serif TC', serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 2px;
  transition: opacity 0.3s;
}

.header__logo:hover {
  opacity: 0.7;
}

.header__search {
  flex: 1;
  max-width: 500px;
  margin: 0 20px;
}

.header__search form {
  width: 100%;
}

.header__search input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid var(--primary);
  border-radius: 50px;
  background: #f0f0f0;
  font-size: 14px;
  transition: all 0.3s;
}

.header__search input:focus {
  outline: none;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 20px;
  font-weight: 500;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.user-profile:hover {
  opacity: 0.7;
}

.login-btn,
.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.login-btn:hover,
.logout-btn:hover {
  background: var(--gray);
}

.logout-btn {
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
}

.logout-btn:hover {
  background: var(--primary);
  color: #fff;
}
</style>

