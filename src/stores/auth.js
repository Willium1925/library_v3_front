import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '../api/auth'


export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)

    // helper: decode JWT payload (base64url)
    function decodeToken(t) {
        if (!t) return null
        try {
            const payload = t.split('.')[1]
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
            const padded = base64 + '='.repeat((4 - base64.length % 4) % 4)
            return JSON.parse(atob(padded))
        } catch {
            return null
        }
    }

    // If token exists on init, set basic user info from token
    if (token.value) {
        const payload = decodeToken(token.value)
        if (payload) user.value = { role: payload.role, username: payload.username || null }
    }

    // Getters
    const isAuthenticated = computed(() => !!token.value)
    const userRole = computed(() => user.value?.role || decodeToken(token.value)?.role || null)
    const isAdmin = computed(() => userRole.value === 'ROLE_ADMIN')
    const isCitizen = computed(() => userRole.value === 'ROLE_CITIZEN')

    // Actions
    async function login(credentials) {
        try {
            const response = await authAPI.login(credentials)
            // LoginResponse 只返回 jwtToken
            token.value = response.jwtToken
            localStorage.setItem('token', response.jwtToken)

            // 先從 token 解析 role，若後端有 getCurrentUser 會再覆蓋完整資料
            const payload = decodeToken(response.jwtToken)
            if (payload) user.value = { role: payload.role, username: payload.username || null }

            // 登入成功後立即獲取使用者資料
            await fetchUserProfile()

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

