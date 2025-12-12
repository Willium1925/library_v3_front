import api from './index'

export default {
  /**
   * 獲取我的收藏列表
   */
  getMyFavorites() {
    return api.get('/favorites/my')
  },

  /**
   * 切換收藏狀態
   */
  toggleFavorite(bookId) {
    return api.post(`/favorites/toggle/${bookId}`)
  },

  /**
   * 檢查是否已收藏
   */
  checkFavorite(bookId) {
    return api.get(`/favorites/check/${bookId}`)
  },

  /**
   * 獲取收藏的書籍 ID 列表
   */
  getFavoriteBookIds() {
    return api.get('/favorites/book-ids')
  },

  /**
   * 新增收藏
   */
  addFavorite(bookId) {
    return api.post(`/favorites/${bookId}`)
  },

  /**
   * 取消收藏
   */
  removeFavorite(bookId) {
    return api.delete(`/favorites/${bookId}`)
  }
}

