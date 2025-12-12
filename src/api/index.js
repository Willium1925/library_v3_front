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
    const data = response.data
    
    // 檢查後端回傳的 success 欄位
    // 如果 success 是 false，表示業務邏輯失敗，需要當作錯誤處理
    if (data && typeof data.success === 'boolean' && data.success === false) {
      const errorMessage = data.message || '操作失敗'
      console.error('業務邏輯錯誤:', errorMessage)
      return Promise.reject(errorMessage)
    }
    
    return data
  },
  (error) => {
    if (error.response) {
      // 伺服器返回錯誤狀態碼
      const { status, data } = error.response

      // 優先使用後端回傳的 message
      //const errorMessage = data?.message || data?.error || '請求失敗'
        const errorMessage = data?.message || data?.error || (typeof data === 'string' ? data : '請求失敗')

      switch (status) {
        case 400:
          console.error('無效操作:', errorMessage)
          return Promise.reject(errorMessage)
        case 401:
          // Token 過期或未授權
          console.error('未授權，請重新登入')
          localStorage.removeItem('token')
          window.location.href = '/login'
          return Promise.reject('未授權，請重新登入')
        case 403:
          console.error('權限不足:', errorMessage)
          return Promise.reject(errorMessage)
        case 404:
          console.error('資源不存在:', errorMessage)
          return Promise.reject(errorMessage)
        case 500:
          console.error('伺服器錯誤:', errorMessage)
          return Promise.reject(errorMessage)
        default:
          console.error('請求失敗:', errorMessage)
          return Promise.reject(errorMessage)
      }
    } else if (error.request) {
      // 請求已發出但沒有收到響應
      console.error('網路錯誤，請檢查網路連線')
      return Promise.reject('網路錯誤，請檢查網路連線')
    } else {
      // 設置請求時發生錯誤
      console.error('請求設置錯誤:', error.message)
      return Promise.reject(error.message || '請求設置錯誤')
    }
  }
)

export default apiClient

