import apiClient from './index'

const categoriesAPI = {
  /**
   * 獲取所有主分類
   */
  getAll() {
    return apiClient.get('/categories')
  },

  /**
   * 獲取所有子分類
   */
  getAllSubs() {
    return apiClient.get('/categorySubs')
  }
}

export default categoriesAPI
export { categoriesAPI }

