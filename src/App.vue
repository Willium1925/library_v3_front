<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useNotificationStore } from './stores/notifications'
import { useFavoritesStore } from './stores/favorites'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const favoritesStore = useFavoritesStore()

onMounted(async () => {
  // 如果已登入，啟動通知輪詢和載入收藏列表
  if (authStore.isAuthenticated) {
    notificationStore.startPolling()
    // 載入使用者的收藏書籍 ID
    try {
      await favoritesStore.fetchFavoriteBookIds()
    } catch (error) {
      console.error('載入收藏列表失敗:', error)
    }
  }
})
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
/* 全域樣式已在 variables.css 中 */
#app {
  min-height: 100vh;
}
</style>
