import apiClient from './index'

export const reservationsAPI = {
  /**
   * 預約書籍副本
   * @param {number} bookCopyId - 書籍副本ID
   */
  reserve(bookCopyId) {
    return apiClient.post('/reservations/reserve', { bookCopyId })
  },

  /**
   * 獲取我的預約列表
   */
  getMyReservations() {
    return apiClient.get('/reservations/my')
  },

  /**
   * 取消預約
   * @param {number} id - 預約ID
   */
  cancel(id) {
    return apiClient.delete(`/reservations/${id}`)
  }
}

