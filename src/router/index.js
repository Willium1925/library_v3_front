import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
    meta: { title: '首頁 - Library System' }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/SearchPage.vue'),
    meta: { title: '搜尋書籍 - Library System' }
  },
  {
    path: '/books/:id',
    name: 'BookDetail',
    component: () => import('../views/BookDetailPage.vue'),
    meta: { title: '書籍詳情 - Library System' }
  },
  {
    path: '/my',
    name: 'MyPage',
    component: () => import('../views/MyPage.vue'),
    meta: { title: '個人中心 - Library System', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全域路由守衛
router.beforeEach((to, from, next) => {
  // 設定頁面標題
  document.title = to.meta.title || 'Library System'

  // 檢查是否需要登入
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      // 未登入，導向首頁或登入頁
      console.warn('需要登入才能訪問此頁面')
      // next('/')
      // 暫時允許訪問，待登入功能完成後啟用
    }
  }

  next()
})

export default router

