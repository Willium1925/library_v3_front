<template>
  <div class="notification-tab">
    <h2 class="panel-header">通知中心</h2>
    
    <div v-if="!loading && notifications.length > 0" class="notifications-list">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        class="notif-item"
        :class="{ unread: !notif.isRead }"
        @click="handleNotificationClick(notif)"
      >
        <div>
          <div class="notif-title">
            <span v-if="!notif.isRead" class="badge-dot"></span>
            {{ notif.title }}
          </div>
          <div class="notif-content">{{ notif.message }}</div>
        </div>
        <div class="notif-date">{{ formatDate(notif.createdAt) }}</div>
      </div>
    </div>
    
    <div v-else-if="loading" class="loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>載入中...</p>
    </div>
    
    <div v-else class="no-data">
      <i class="fa-regular fa-bell-slash"></i>
      <p>暫無通知</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useNotificationStore } from '../../stores/notifications'

const notificationStore = useNotificationStore()

const loading = computed(() => notificationStore.loading)
const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW')
}

const handleNotificationClick = async (notif) => {
  if (!notif.isRead) {
    await notificationStore.markAsRead(notif.id)
  }
}

const markAllAsRead = async () => {
  await notificationStore.markAllAsRead()
}

onMounted(() => {
  notificationStore.fetchNotifications()
})
</script>

<style scoped>
.notification-tab {
  animation: fadeIn 0.3s;
}

.panel-header {
  font-family: 'Noto Serif TC', serif;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--primary);
}

.notifications-list {
  display: flex;
  flex-direction: column;
}

.notif-item {
  background: #fff;
  border: 1px solid var(--light-border);
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 5px solid transparent;
  cursor: pointer;
  transition: 0.2s;
}

.notif-item:hover {
  transform: translateX(5px);
}

.notif-item.unread {
  border-left-color: var(--accent);
  background: #fffafa;
}

.notif-title {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 5px;
}

.badge-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: var(--accent);
  border-radius: 50%;
  margin-right: 8px;
}

.notif-content {
  color: #555;
  font-size: 14px;
}

.notif-date {
  font-size: 12px;
  color: var(--gray);
  min-width: 80px;
  text-align: right;
}

.loading,
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--gray);
}

.loading i,
.no-data i {
  font-size: 50px;
  margin-bottom: 15px;
  opacity: 0.5;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

