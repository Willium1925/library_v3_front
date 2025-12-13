import apiClient from '../index'

export const adminUsersAPI = {
  // 根據 cardId 查詢使用者（借還書用）
  getByCardId(cardId) {
    return apiClient.get(`/admin/users/by-card/${cardId}`)
  },

  // 會員搜尋
  search(params) {
    return apiClient.get('/admin/users/search', { params })
  },

  // 獲取會員詳情
  getById(userId) {
    return apiClient.get(`/admin/users/${userId}`)
  },

  // 開通帳號
  activate(userId) {
    return apiClient.put(`/admin/users/${userId}/activate`)
  },

  // 停權
  suspend(userId) {
    return apiClient.put(`/admin/users/${userId}/suspend`)
  },

  // 復權
  restore(userId) {
    return apiClient.put(`/admin/users/${userId}/restore`)
  },

  // 查詢會員借閱記錄
  getLoans(userId) {
    return apiClient.get(`/admin/users/${userId}/loans`)
  },

  // 查詢會員預約記錄
  getReservations(userId) {
    return apiClient.get(`/admin/users/${userId}/reservations`)
  }
}
export default adminUsersAPI


