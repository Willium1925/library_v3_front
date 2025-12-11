import { defineStore } from 'pinia'
import { ref } from 'vue'
import { booksAPI } from '../api/books'

export const useBooksStore = defineStore('books', () => {
  // State
  const currentBook = ref(null)
  const searchResults = ref([])
  const searchStats = ref(null)
  const pagination = ref({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 20
  })
  const loading = ref(false)
  
  // Search Filters
  const filters = ref({
    keyword: '',
    mainCategoryId: null,
    subCategoryId: null,
    authorId: null,
    publisherId: null,
    seriesDisplay: null,
    tags: []
  })
  
  // Sort Options
  const sortBy = ref('addedDate')
  const sortDirection = ref('desc')
  
  // Actions
  async function searchBooks(params = {}) {
    try {
      loading.value = true
      
      const searchParams = {
        ...filters.value,
        ...params,
        page: params.page || 0,
        size: params.size || 20,
        sort: `${sortBy.value},${sortDirection.value}`
      }
      
      const response = await booksAPI.search(searchParams)
      
      searchResults.value = response.bookPage.content
      pagination.value = {
        currentPage: response.bookPage.currentPage,
        totalPages: response.bookPage.totalPages,
        totalElements: response.bookPage.totalElements,
        pageSize: response.bookPage.pageSize
      }
      searchStats.value = response.stats
      
      return response
    } catch (error) {
      console.error('搜尋書籍失敗:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  async function fetchBookById(id) {
    try {
      loading.value = true
      currentBook.value = await booksAPI.getById(id)
      return currentBook.value
    } catch (error) {
      console.error('獲取書籍詳情失敗:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  function updateFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }
  
  function updateSort(field, direction) {
    sortBy.value = field
    sortDirection.value = direction
  }
  
  function resetFilters() {
    filters.value = {
      keyword: '',
      mainCategoryId: null,
      subCategoryId: null,
      authorId: null,
      publisherId: null,
      seriesDisplay: null,
      tags: []
    }
  }
  
  return {
    currentBook,
    searchResults,
    searchStats,
    pagination,
    loading,
    filters,
    sortBy,
    sortDirection,
    searchBooks,
    fetchBookById,
    updateFilters,
    updateSort,
    resetFilters
  }
})

