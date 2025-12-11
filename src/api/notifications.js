import apiClient from './index'

export const notificationsAPI = {
  /**
   * 獲取所有通知
   */
  getAll() {
    return apiClient.get('/notifications')
  },

  /**
   * 獲取未讀通知數量
   */
  getUnreadCount() {
    return apiClient.get('/notifications/unread-count')
  },

  /**
   * 標記通知為已讀
   * @param {number} id - 通知ID
   */
  markAsRead(id) {
    return apiClient.put(`/notifications/${id}/read`)
  },

  /**
   * 標記所有通知為已讀
   */
  markAllAsRead() {
    return apiClient.put('/notifications/read-all')
  }
}

