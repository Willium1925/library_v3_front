import apiClient from './index'

export default {
  /**
   * 獲取書籍評論列表
   * @param {number} bookId 
   * @param {object} params { page, size, sort }
   */
  getReviews(bookId, params) {
    return apiClient.get(`/books/${bookId}/reviews`, { params })
  },

  /**
   * 新增評論
   * @param {number} bookId 
   * @param {object} data { rating, reviewText }
   */
  addReview(bookId, data) {
    return apiClient.post(`/books/${bookId}/reviews`, data)
  },

  /**
   * 編輯評論
   * @param {number} bookId 
   * @param {number} reviewId 
   * @param {object} data { rating, reviewText }
   */
  updateReview(bookId, reviewId, data) {
    return apiClient.put(`/books/${bookId}/reviews/${reviewId}`, data)
  },

  /**
   * 刪除評論
   * @param {number} bookId 
   * @param {number} reviewId 
   */
  deleteReview(bookId, reviewId) {
    return apiClient.delete(`/books/${bookId}/reviews/${reviewId}`)
  },

  /**
   * Toggle 按讚（按過就取消，沒按過就新增）
   * @param {number} bookId 
   * @param {number} reviewId 
   */
  toggleLike(bookId, reviewId) {
    return apiClient.post(`/books/${bookId}/reviews/${reviewId}/like`)
  },

  /**
   * 取消按讚（舊版 API，保留以防萬一）
   * @param {number} bookId 
   * @param {number} reviewId 
   */
  unlikeReview(bookId, reviewId) {
    return apiClient.delete(`/books/${bookId}/reviews/${reviewId}/like`)
  }
}
