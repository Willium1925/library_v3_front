import apiClient from '../index'

export const adminCategoriesAPI = {
  // 新增主分類
  createMain(data) {
    return apiClient.post('/admin/categories', data)
  },

  // 更新主分類
  updateMain(id, data) {
    return apiClient.put(`/admin/categories/${id}`, data)
  },

  // 刪除主分類
  deleteMain(id) {
    return apiClient.delete(`/admin/categories/${id}`)
  },

  // 新增子分類
  createSub(data) {
    return apiClient.post('/admin/category-subs', data)
  },

  // 更新子分類
  updateSub(id, data) {
    return apiClient.put(`/admin/category-subs/${id}`, data)
  },

  // 刪除子分類
  deleteSub(id) {
    return apiClient.delete(`/admin/category-subs/${id}`)
  }
}
export default adminCategoriesAPI


