import apiClient from '../index'

// 通用的 CRUD 函數工廠
const createEntityAPI = (basePath) => ({
  getAll() {
    return apiClient.get(basePath)
  },

  search(keyword) {
    return apiClient.get(`${basePath}/search`, { params: { keyword } })
  },

  create(data) {
    return apiClient.post(basePath, data)
  },

  update(id, data) {
    return apiClient.put(`${basePath}/${id}`, data)
  },

  delete(id) {
    return apiClient.delete(`${basePath}/${id}`)
  }
})

// 作者 API
export const authorsAPI = createEntityAPI('/authors')

// 出版商 API
export const publishersAPI = createEntityAPI('/publishers')

// 系列 API
export const seriesAPI = createEntityAPI('/series')

// 標籤 API
export const tagsAPI = createEntityAPI('/tags')

export default {
  authors: authorsAPI,
  publishers: publishersAPI,
  series: seriesAPI,
  tags: tagsAPI
}

