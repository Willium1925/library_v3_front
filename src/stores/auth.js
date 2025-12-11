import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '../api/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  
  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || null)
  const isAdmin = computed(() => userRole.value === 'ROLE_ADMIN')
  const isCitizen = computed(() => userRole.value === 'ROLE_CITIZEN')
  
  // Actions
  async function login(credentials) {
    try {
      const response = await authAPI.login(credentials)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
      return true
    } catch (error) {
      console.error('登入失敗:', error)
      throw error
    }
  }
  
  async function logout() {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('登出失敗:', error)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
    }
  }
  
  async function fetchUserProfile() {
    try {
      const userData = await authAPI.getCurrentUser()
      user.value = userData
      return userData
    } catch (error) {
      console.error('獲取使用者資料失敗:', error)
      throw error
    }
  }
  
  // 初始化時檢查 token 並獲取使用者資料
  async function initialize() {
    if (token.value) {
      try {
        await fetchUserProfile()
      } catch (error) {
        // Token 無效，清除
        logout()
      }
    }
  }
  
  return {
    user,
    token,
    isAuthenticated,
    userRole,
    isAdmin,
    isCitizen,
    login,
    logout,
    fetchUserProfile,
    initialize
  }
})

