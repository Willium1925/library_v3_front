<template>
  <div class="my-page">
    <TheHeader />
    
    <div class="dashboard-container">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          class="nav-item"
          :class="{ active: currentTab === tab.id }"
          :style="tab.isWarning ? 'color: var(--accent);' : ''"
          @click="currentTab = tab.id"
        >
          <i :class="tab.icon"></i>
          {{ tab.name }}
          <span v-if="tab.badge" class="badge">{{ tab.badge }}</span>
        </div>
      </aside>
      
      <!-- Main Content -->
      <main class="content-area">
        <component :is="currentTabComponent" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotificationStore } from '../stores/notifications'
import TheHeader from '../components/common/TheHeader.vue'
import NotificationTab from './tabs/NotificationTab.vue'
import ProfileTab from './tabs/ProfileTab.vue'
import ReservationsTab from './tabs/ReservationsTab.vue'
import LoansTab from './tabs/LoansTab.vue'
import HistoryTab from './tabs/HistoryTab.vue'
import OverdueTab from './tabs/OverdueTab.vue'
import FavoritesTab from './tabs/FavoritesTab.vue'

const notificationStore = useNotificationStore()

const currentTab = ref('notifications')

const tabs = computed(() => [
  {
    id: 'notifications',
    name: '通知中心',
    icon: 'fa-regular fa-bell',
    badge: notificationStore.unreadCount > 0 ? notificationStore.unreadCount : null
  },
  {
    id: 'profile',
    name: '個人檔案',
    icon: 'fa-regular fa-id-card'
  },
  {
    id: 'reservations',
    name: '預約書籍',
    icon: 'fa-regular fa-calendar-check'
  },
  {
    id: 'loans',
    name: '目前借閱',
    icon: 'fa-solid fa-book-open'
  },
  {
    id: 'history',
    name: '借閱歷史',
    icon: 'fa-solid fa-clock-rotate-left'
  },
  {
    id: 'overdue',
    name: '逾期未還',
    icon: 'fa-solid fa-triangle-exclamation',
    isWarning: true
  },
  {
    id: 'favorites',
    name: '收藏清單',
    icon: 'fa-regular fa-heart'
  }
])

const currentTabComponent = computed(() => {
  const components = {
    notifications: NotificationTab,
    profile: ProfileTab,
    reservations: ReservationsTab,
    loans: LoansTab,
    history: HistoryTab,
    overdue: OverdueTab,
    favorites: FavoritesTab
  }
  return components[currentTab.value] || NotificationTab
})

onMounted(() => {
  // 獲取未讀通知數量
  notificationStore.fetchUnreadCount()
})
</script>

<style scoped>
.my-page {
  min-height: 100vh;
  background: var(--bg);
}

.dashboard-container {
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 20px 80px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 40px;
  min-height: 80vh;
}

/* Sidebar Navigation */
.sidebar {
  background: #fff;
  border: 1px solid var(--border-color);
  height: fit-content;
  position: sticky;
  top: 120px;
}

.nav-item {
  padding: 18px 25px;
  border-bottom: 1px solid var(--light-border);
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: 0.2s;
  position: relative;
}

.nav-item:last-child {
  border-bottom: none;
}

.nav-item:hover {
  background: #f4f4f4;
}

.nav-item.active {
  background: var(--primary);
  color: #fff;
}

.nav-item i {
  width: 20px;
  text-align: center;
}

.badge {
  position: absolute;
  right: 15px;
  background: var(--accent);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

/* Content Area */
.content-area {
  min-height: 500px;
}

/* Responsive */
@media (max-width: 992px) {
  .dashboard-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .sidebar {
    position: static;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .nav-item {
    justify-content: center;
    text-align: center;
    padding: 15px 10px;
  }
}
</style>

