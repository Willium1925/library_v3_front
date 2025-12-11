import apiClient from './index'

export const tagsAPI = {
  /**
   * 獲取熱門標籤 Top 10
   * @param {number} categoryId - 分類ID（可選）
   */
  getTop10(categoryId = null) {
    const url = categoryId ? `/tags/home/top10/${categoryId}` : '/tags/home/top10'
    return apiClient.get(url)
  },

  /**
   * 獲取所有標籤
   */
  getAll() {
    return apiClient.get('/tags')
  }
}

