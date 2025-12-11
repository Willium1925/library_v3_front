<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useNotificationStore } from './stores/notifications'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

onMounted(() => {
  // 如果已登入，啟動通知輪詢
  if (authStore.isAuthenticated) {
    notificationStore.startPolling()
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
