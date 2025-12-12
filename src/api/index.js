import axios from 'axios'

// 創建 axios 實例
const apiClient = axios.create({
  baseURL: 'http://localhost:8083/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 請求攔截器 - 自動添加 JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('請求錯誤:', error)
    return Promise.reject(error)
  }
)

// 響應攔截器 - 統一錯誤處理
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      // 伺服器返回錯誤狀態碼
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Token 過期或未授權
          console.error('未授權，請重新登入')
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          console.error('權限不足')
          break
        case 404:
          console.error('資源不存在')
          break
        case 500:
          console.error('伺服器錯誤')
          break
        default:
          console.error('請求失敗:', data?.message || '帳號或密碼錯誤')
      }
      
      return Promise.reject(data?.message || '帳號或密碼錯誤')
    } else if (error.request) {
      // 請求已發出但沒有收到響應
      console.error('網路錯誤，請檢查網路連線')
      return Promise.reject('網路錯誤')
    } else {
      // 設置請求時發生錯誤
      console.error('請求設置錯誤:', error.message)
      return Promise.reject(error.message)
    }
  }
)

export default apiClient

