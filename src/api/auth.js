import apiClient from './index'

export const authAPI = {
  /**
   * 使用者登入
   * @param {Object} credentials
   * @param {string} credentials.account - 帳號
   * @param {string} credentials.password - 密碼
   */
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },

  /**
   * 使用者登出
   */
  logout() {
    return apiClient.post('/auth/logout')
  },

  /**
   * 註冊新帳號
   * @param {Object} data - 註冊資料
   */
  register(data) {
    return apiClient.post('/users/register', data)
  },

  /**
   * 獲取當前使用者資料
   */
  getCurrentUser() {
    return apiClient.get('/users/me/profile')
  },

  /**
   * 驗證舊密碼
   * @param {string} oldPassword
   */
  verifyOldPassword(oldPassword) {
    return apiClient.post('/users/me/change-password/verify-old', { oldPassword })
  },

  /**
   * 修改密碼
   * @param {Object} data
   * @param {string} data.oldPassword
   * @param {string} data.newPassword
   */
  changePassword(data) {
    return apiClient.post('/users/me/change-password', data)
  }
}
