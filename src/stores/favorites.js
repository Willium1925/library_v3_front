import { defineStore } from 'pinia'
import { ref } from 'vue'
import favoritesAPI from '../api/favorites'

export const useFavoritesStore = defineStore('favorites', () => {
  // State
  const favoriteBookIds = ref(new Set())
  const favorites = ref([])
  const loading = ref(false)

  // Getters
  // change to a simple function that reads the reactive Set
  const isFavorited = (bookId) => {
    return favoriteBookIds.value.has(bookId)
  }

  // Actions
  async function fetchFavorites() {
    try {
      loading.value = true
      const data = await favoritesAPI.getMyFavorites()
      favorites.value = data
      // 更新 ID Set
      favoriteBookIds.value = new Set(data.map(f => f.bookId))
    } catch (error) {
      console.error('獲取收藏列表失敗:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchFavoriteBookIds() {
    try {
      const ids = await favoritesAPI.getFavoriteBookIds()
      favoriteBookIds.value = new Set(ids)
    } catch (error) {
      console.error('獲取收藏 ID 列表失敗:', error)
      throw error
    }
  }

  async function toggleFavorite(bookId) {
    try {
      const result = await favoritesAPI.toggleFavorite(bookId)

      // 處理後端不同的回傳格式
      let isNowFavorited = undefined

      if (typeof result === 'boolean') {
        isNowFavorited = result
      } else if (result && typeof result.isFavorited === 'boolean') {
        isNowFavorited = result.isFavorited
      } else if (result && typeof result.favorited === 'boolean') {
        isNowFavorited = result.favorited
      }

      // 若後端沒提供明確結果，採用 local optimistic toggle 的結果
      if (typeof isNowFavorited === 'undefined') {
        isNowFavorited = !favoriteBookIds.value.has(bookId)
      }

      // 更新本地狀態
      if (isNowFavorited) {
        favoriteBookIds.value.add(bookId)
        // 重新指派 Set 來觸發 Vue 的反應性更新
        favoriteBookIds.value = new Set(favoriteBookIds.value)
      } else {
        favoriteBookIds.value.delete(bookId)
        favoriteBookIds.value = new Set(favoriteBookIds.value)
      }

      return isNowFavorited
    } catch (error) {
      console.error('切換收藏狀態失敗:', error)
      throw error
    }
  }

  async function removeFavorite(bookId) {
    try {
      await favoritesAPI.removeFavorite(bookId)
      favoriteBookIds.value.delete(bookId)
      favoriteBookIds.value = new Set(favoriteBookIds.value)
      // 重新獲取收藏列表
      await fetchFavorites()
    } catch (error) {
      console.error('取消收藏失敗:', error)
      throw error
    }
  }

  return {
    favoriteBookIds,
    favorites,
    loading,
    isFavorited,
    fetchFavorites,
    fetchFavoriteBookIds,
    toggleFavorite,
    removeFavorite
  }
})
