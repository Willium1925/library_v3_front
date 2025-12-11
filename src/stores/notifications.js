import { defineStore } from 'pinia'
import { ref } from 'vue'
import { notificationsAPI } from '../api/notifications'
import { useIntervalFn } from '@vueuse/core'

export const useNotificationStore = defineStore('notifications', () => {
  // State
  const notifications = ref([])
  const unreadCount = ref(0)
  const loading = ref(false)
  
  // Actions
  async function fetchNotifications() {
    try {
      loading.value = true
      notifications.value = await notificationsAPI.getAll()
    } catch (error) {
      console.error('獲取通知失敗:', error)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchUnreadCount() {
    try {
      unreadCount.value = await notificationsAPI.getUnreadCount()
    } catch (error) {
      console.error('獲取未讀數量失敗:', error)
    }
  }
  
  async function markAsRead(notificationId) {
    try {
      await notificationsAPI.markAsRead(notificationId)
      // 更新本地狀態
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.isRead = true
      }
      // 更新未讀數量
      if (unreadCount.value > 0) {
        unreadCount.value--
      }
    } catch (error) {
      console.error('標記已讀失敗:', error)
      throw error
    }
  }
  
  async function markAllAsRead() {
    try {
      await notificationsAPI.markAllAsRead()
      // 更新本地狀態
      notifications.value.forEach(n => n.isRead = true)
      unreadCount.value = 0
    } catch (error) {
      console.error('標記全部已讀失敗:', error)
      throw error
    }
  }
  
  // 啟動輪詢（每30秒檢查一次未讀數量）
  const { pause, resume } = useIntervalFn(() => {
    fetchUnreadCount()
  }, 30000) // 30 seconds
  
  function startPolling() {
    fetchUnreadCount() // 立即執行一次
    resume()
  }
  
  function stopPolling() {
    pause()
  }
  
  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    startPolling,
    stopPolling
  }
})

