import apiClient from './index'

export const reviewsAPI = {
  /**
   * 獲取書籍的評論列表
   * @param {number} bookId - 書籍ID
   * @param {Object} params - 分頁參數
   */
  getByBookId(bookId, params = {}) {
    return apiClient.get(`/books/${bookId}/reviews`, { params })
  },

  /**
   * 新增評論
   * @param {number} bookId - 書籍ID
   * @param {Object} data
   * @param {number} data.rating - 評分（1-5）
   * @param {string} data.reviewText - 評論內容
   */
  addReview(bookId, data) {
    return apiClient.post(`/books/${bookId}/reviews`, data)
  },

  /**
   * 更新評論
   * @param {number} bookId - 書籍ID
   * @param {number} reviewId - 評論ID
   * @param {Object} data
   */
  updateReview(bookId, reviewId, data) {
    return apiClient.put(`/books/${bookId}/reviews/${reviewId}`, data)
  },

  /**
   * 刪除評論
   * @param {number} bookId - 書籍ID
   * @param {number} reviewId - 評論ID
   */
  deleteReview(bookId, reviewId) {
    return apiClient.delete(`/books/${bookId}/reviews/${reviewId}`)
  },

  /**
   * 對評論按讚
   * @param {number} bookId - 書籍ID
   * @param {number} reviewId - 評論ID
   */
  likeReview(bookId, reviewId) {
    return apiClient.post(`/books/${bookId}/reviews/${reviewId}/like`)
  },

  /**
   * 取消對評論的讚
   * @param {number} bookId - 書籍ID
   * @param {number} reviewId - 評論ID
   */
  unlikeReview(bookId, reviewId) {
    return apiClient.delete(`/books/${bookId}/reviews/${reviewId}/like`)
  }
}

