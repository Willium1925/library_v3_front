<template>
  <div class="notificationbox" @click="toggleDropdown">
    <i class="fa-regular fa-bell"></i>
    <span v-if="unreadCount > 0" class="dot"></span>
    
    <!-- 通知下拉選單 -->
    <div v-if="showDropdown" class="notification-dropdown">
      <div class="notification-header">
        <h3>通知</h3>
        <button v-if="notifications.length > 0" @click.stop="markAllRead" class="mark-all-btn">
          全部標示為已讀
        </button>
      </div>
      
      <div class="notification-list">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
          :class="{ unread: !notification.isRead }"
          @click.stop="handleNotificationClick(notification)"
        >
          <div class="notification-content">
            <p class="notification-title">{{ notification.title }}</p>
            <p class="notification-message">{{ notification.content }}</p>
            <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
          </div>
          <i v-if="!notification.isRead" class="fa-solid fa-circle unread-dot"></i>
        </div>
        
        <div v-if="notifications.length === 0" class="no-notifications">
          <i class="fa-regular fa-bell-slash"></i>
          <p>暫無通知</p>
        </div>
      </div>
      
      <router-link to="/my" class="view-all-link" @click="showDropdown = false">
        查看所有通知
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '../../stores/notifications'
import { useRouter } from 'vue-router'

const notificationStore = useNotificationStore()
const router = useRouter()

const showDropdown = ref(false)

const unreadCount = computed(() => notificationStore.unreadCount)
const notifications = computed(() => notificationStore.notifications.slice(0, 5)) // 只顯示最新 5 條

const toggleDropdown = async () => {
  showDropdown.value = !showDropdown.value
  if (showDropdown.value && notifications.value.length === 0) {
    await notificationStore.fetchNotifications()
  }
}

const handleNotificationClick = async (notification) => {
  if (!notification.isRead) {
    await notificationStore.markAsRead(notification.id)
  }
  showDropdown.value = false
  // 可以根據通知類型導向不同頁面
  router.push('/my')
}

const markAllRead = async () => {
  await notificationStore.markAllAsRead()
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000) // 秒
  
  if (diff < 60) return '剛剛'
  if (diff < 3600) return `${Math.floor(diff / 60)} 分鐘前`
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小時前`
  if (diff < 604800) return `${Math.floor(diff / 86400)} 天前`
  
  return date.toLocaleDateString('zh-TW')
}

// 點擊外部關閉下拉選單
const handleClickOutside = (event) => {
  const dropdown = event.target.closest('.notificationbox')
  if (!dropdown && showDropdown.value) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.notificationbox {
  position: relative;
  cursor: pointer;
  font-size: 20px;
  transition: opacity 0.3s;
}

.notificationbox:hover {
  opacity: 0.7;
}

.dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: var(--accent);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 下拉選單 */
.notification-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 350px;
  max-height: 500px;
  background: #fff;
  border: 1px solid var(--light-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--light-border);
}

.notification-header h3 {
  font-size: 16px;
  font-weight: 700;
}

.mark-all-btn {
  font-size: 12px;
  color: var(--gray);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.mark-all-btn:hover {
  color: var(--primary);
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 15px;
  border-bottom: 1px solid var(--light-border);
  cursor: pointer;
  transition: background 0.2s;
}

.notification-item:hover {
  background: #f9f9f9;
}

.notification-item.unread {
  background: #f0f8ff;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 4px;
}

.notification-message {
  font-size: 13px;
  color: var(--gray);
  margin-bottom: 4px;
}

.notification-time {
  font-size: 11px;
  color: var(--gray);
}

.unread-dot {
  color: var(--accent);
  font-size: 8px;
  margin-top: 5px;
}

.no-notifications {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--gray);
}

.no-notifications i {
  font-size: 40px;
  margin-bottom: 10px;
  opacity: 0.5;
}

.view-all-link {
  display: block;
  text-align: center;
  padding: 12px;
  background: #f9f9f9;
  border-top: 1px solid var(--light-border);
  font-size: 13px;
  font-weight: 500;
  color: var(--primary);
  transition: background 0.2s;
  border-radius: 0 0 8px 8px;
}

.view-all-link:hover {
  background: #f0f0f0;
}
</style>

