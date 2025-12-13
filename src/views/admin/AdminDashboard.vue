<template>
  <div class="admin-layout">
    <!-- 左側選單 -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h2>管理後台</h2>
      </div>
      <nav class="sidebar-nav">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </router-link>
        <a href="/" class="nav-item" @click.prevent="backToHome">
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回前台</span>
        </a>
      </nav>
    </aside>

    <!-- 右側內容區 -->
    <main class="admin-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const menuItems = [
  { path: '/admin/borrow', label: '借書', icon: 'fa-solid fa-book-open' },
  { path: '/admin/return', label: '還書', icon: 'fa-solid fa-rotate-left' },
  { path: '/admin/books', label: '書籍', icon: 'fa-solid fa-book' },
  { path: '/admin/categories', label: '分類', icon: 'fa-solid fa-layer-group' },
  { path: '/admin/authors', label: '作者', icon: 'fa-solid fa-user-pen' },
  { path: '/admin/publishers', label: '出版商', icon: 'fa-solid fa-building' },
  { path: '/admin/series', label: '系列', icon: 'fa-solid fa-list' },
  { path: '/admin/tags', label: '標籤', icon: 'fa-solid fa-tags' },
  { path: '/admin/users', label: '會員', icon: 'fa-solid fa-users' }
]

const backToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.admin-sidebar {
  width: 200px;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 24px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
}

.sidebar-nav {
  flex: 1;
  padding: 8px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #374151;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 14px;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background-color: #f9fafb;
  color: var(--primary);
}

.nav-item.active {
  background-color: #eff6ff;
  color: var(--primary);
  border-left-color: var(--primary);
  font-weight: 500;
}

.nav-item i {
  width: 20px;
  text-align: center;
}

.admin-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>

