import apiClient from './index'

export const booksAPI = {
  /**
   * 搜尋書籍
   * @param {Object} params - 查詢參數
   * @param {string} params.keyword - 關鍵字
   * @param {number} params.page - 頁碼（從0開始）
   * @param {number} params.size - 每頁筆數
   * @param {string} params.sort - 排序（如：addedDate,desc）
   * @param {number} params.mainCategoryId - 主分類ID
   * @param {number} params.subCategoryId - 子分類ID
   * @param {number} params.authorId - 作者ID
   * @param {number} params.publisherId - 出版社ID
   * @param {number} params.seriesDisplay - 系列作顯示模式（1=僅代表作，0=全部）
   * @param {Array} params.tags - 標籤ID陣列
   */
  search(params) {
    return apiClient.get('/books', { params })
  },

  /**
   * 獲取書籍詳情
   * @param {number} id - 書籍ID
   */
  getById(id) {
    return apiClient.get(`/books/${id}`)
  },

  /**
   * 獲取最新上架書籍（Top 5）
   * @param {number} categoryId - 分類ID（可選）
   */
  getTop5New(categoryId = null) {
    const url = categoryId ? `/books/home/top5new/${categoryId}` : '/books/home/top5new'
    return apiClient.get(url)
  },

  /**
   * 獲取熱門借閱書籍（Top 5）
   * @param {number} categoryId - 分類ID（可選）
   */
  getTop5Loan(categoryId = null) {
    const url = categoryId ? `/books/home/top5loan/${categoryId}` : '/books/home/top5loan'
    return apiClient.get(url)
  }
}

