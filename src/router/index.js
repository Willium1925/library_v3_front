import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

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
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue'),
    meta: { title: '會員登入 - Library System' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterPage.vue'),
    meta: { title: '會員註冊 - Library System' }
  },
  {
    path: '/my',
    name: 'MyPage',
    component: () => import('../views/MyPage.vue'),
    meta: { title: '個人中心 - Library System', requiresAuth: true }
  },
  // 管理員路由
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/admin/AdminDashboard.vue'),
    meta: { title: '管理後台 - Library System', requiresAuth: true, requiresAdmin: true },
    redirect: '/admin/borrow',
    children: [
      {
        path: 'borrow',
        name: 'AdminBorrow',
        component: () => import('../views/admin/BorrowBook.vue'),
        meta: { title: '借書管理 - Library System', requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'return',
        name: 'AdminReturn',
        component: () => import('../views/admin/ReturnBook.vue'),
        meta: { title: '還書管理 - Library System', requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'books',
        name: 'AdminBooks',
        component: () => import('../views/admin/BooksManagement.vue'),
        meta: { title: '書籍管理 - Library System', requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('../views/admin/CategoriesManagement.vue'),
        meta: { title: '分類管理 - Library System', requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'authors',
        name: 'AdminAuthors',
        component: () => import('../views/admin/AuthorsManagement.vue'),
        meta: { title: '作者管理 - Library System', requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'publishers',
        name: 'AdminPublishers',
        component: () => import('../views/admin/PublishersManagement.vue'),
        meta: { title: '出版商管理 - Library System', requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'series',
        name: 'AdminSeries',
        component: () => import('../views/admin/SeriesManagement.vue'),
        meta: { title: '系列管理 - Library System', requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'tags',
        name: 'AdminTags',
        component: () => import('../views/admin/TagsManagement.vue'),
        meta: { title: '標籤管理 - Library System', requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../views/admin/UsersManagement.vue'),
        meta: { title: '會員管理 - Library System', requiresAuth: true, requiresAdmin: true }
      }
    ]
  },
  // 副本記錄頁面（新分頁）
  {
    path: '/admin/copy/:copyId/loans',
    name: 'CopyLoanHistory',
    component: () => import('../views/admin/CopyLoanHistory.vue'),
    meta: { title: '副本借閱記錄 - Library System', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/copy/:copyId/reservations',
    name: 'CopyReservationHistory',
    component: () => import('../views/admin/CopyReservationHistory.vue'),
    meta: { title: '副本預約記錄 - Library System', requiresAuth: true, requiresAdmin: true }
  },
  // 會員記錄頁面（新分頁）
  {
    path: '/admin/user/:userId/loans',
    name: 'UserLoanHistory',
    component: () => import('../views/admin/UserLoanHistory.vue'),
    meta: { title: '會員借閱記錄 - Library System', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/user/:userId/reservations',
    name: 'UserReservationHistory',
    component: () => import('../views/admin/UserReservationHistory.vue'),
    meta: { title: '會員預約記錄 - Library System', requiresAuth: true, requiresAdmin: true }
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

  const authStore = useAuthStore()

  // 檢查是否需要管理員權限
  if (to.meta.requiresAdmin) {
    if (!authStore.isAuthenticated) {
      // 未登入，導向登入頁
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    if (!authStore.isAdmin) {
      // 已登入但非管理員，導向首頁並提示
      alert('您沒有權限訪問此頁面' + "身份" + authStore.userRole)
      next('/')
      return
    }
  }
  
  // 檢查是否需要登入
  if (to.meta.requiresAuth && !to.meta.requiresAdmin) {
    const token = localStorage.getItem('token')
    if (!token) {
      // 未登入，導向登入頁
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }

  // 如果已登入且試圖訪問登入/註冊頁，導向首頁
  if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    next('/')
    return
  }

  next()
})

export default router

