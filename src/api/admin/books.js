import apiClient from '../index'

export const adminBooksAPI = {
  // 搜尋書籍
  search(params) {
    return apiClient.get('/admin/books', { params })
  },

  // 獲取單本書詳情
  getById(id) {
    return apiClient.get(`/admin/books/${id}`)
  },

  // 新增書籍
  create(data) {
    return apiClient.post('/admin/books', data)
  },

  // 更新書籍
  update(id, data) {
    return apiClient.put(`/admin/books/${id}`, data)
  },

  // 刪除書籍
  delete(id) {
    return apiClient.delete(`/admin/books/${id}`)
  },

  // 獲取書籍副本列表
  getCopies(bookId) {
    return apiClient.get(`/admin/books/${bookId}/copies`)
  },

  // 新增書籍副本
  createCopy(bookId, copyData) {
    return apiClient.post(`/admin/books/${bookId}/copies`, copyData)
  },

  // 刪除副本
  deleteCopy(copyId) {
    return apiClient.delete(`/admin/book-copies/${copyId}`)
  },

  // 獲取副本借閱記錄
  getCopyLoanHistory(copyId) {
    return apiClient.get(`/admin/book-copies/${copyId}/loan-history`)
  },

  // 獲取副本預約記錄
  getCopyReservationHistory(copyId) {
    return apiClient.get(`/admin/book-copies/${copyId}/reservation-history`)
  }
}
export default adminBooksAPI


