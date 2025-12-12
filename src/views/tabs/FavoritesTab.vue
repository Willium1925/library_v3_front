<template>
  <div class="favorites-tab">
    <h2 class="panel-header">收藏清單</h2>
    
    <div v-if="!loading && favorites.length > 0" class="favorites-list">
      <BookListCard
        v-for="favorite in favorites"
        :key="favorite.id"
        :book="{
          id: favorite.bookId,
          title: favorite.title,
          author: favorite.author,
          imageUrl: favorite.imageUrl,
          uniqueCode: '—'
        }"
      >
        <template #meta>
          <div class="card-meta">收藏日期：{{ formatDate(favorite.createdAt) }}</div>
        </template>
        <template #status>
          <button class="btn btn-sm btn-outline-danger" @click="handleRemove(favorite.bookId)">
            <i class="fa-regular fa-trash-can"></i> 取消收藏
          </button>
        </template>
      </BookListCard>
    </div>
    
    <div v-else-if="loading" class="loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>載入中...</p>
    </div>
    
    <div v-else class="no-data">
      <i class="fa-regular fa-heart"></i>
      <p>尚無收藏書籍</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useFavoritesStore } from '../../stores/favorites'
import BookListCard from '../../components/user/BookListCard.vue'

const favoritesStore = useFavoritesStore()

const loading = computed(() => favoritesStore.loading)
const favorites = computed(() => favoritesStore.favorites)

const fetchFavorites = async () => {
  try {
    await favoritesStore.fetchFavorites()
  } catch (error) {
    console.error('獲取收藏清單失敗:', error)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW')
}

const handleRemove = async (bookId) => {
  if (confirm('確定要取消收藏嗎？')) {
    try {
      await favoritesStore.removeFavorite(bookId)
    } catch (error) {
      alert('取消收藏失敗：' + (error.message || error))
    }
  }
}

onMounted(() => {
  fetchFavorites()
})
</script>

<style scoped>
.favorites-tab {
  animation: fadeIn 0.3s;
}

.panel-header {
  font-family: 'Noto Serif TC', serif;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--primary);
}

.favorites-list {
  display: flex;
  flex-direction: column;
}

.btn {
  padding: 10px 25px;
  border: 1px solid var(--primary);
  background: transparent;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn:hover {
  background: var(--primary);
  color: #fff;
}

.btn-sm {
  padding: 5px 15px;
  font-size: 13px;
}

.btn-outline-danger {
  border-color: var(--accent);
  color: var(--accent);
}

.btn-outline-danger:hover {
  background: var(--accent);
  color: #fff;
}

.loading,
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--gray);
}

.loading i,
.no-data i {
  font-size: 50px;
  margin-bottom: 15px;
  opacity: 0.5;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

