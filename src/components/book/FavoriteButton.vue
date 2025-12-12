<template>
  <button
    class="favorite-btn"
    :class="{ 'is-favorited': displayedFavorited }"
    @click.stop="handleToggle"
    :disabled="loading"
    :title="displayedFavorited ? '取消收藏' : '加入收藏'"
  >
    <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
    <i v-else-if="displayedFavorited" class="fa-solid fa-heart"></i>
    <i v-else class="fa-regular fa-heart"></i>
  </button>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFavoritesStore } from '../../stores/favorites'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  bookId: {
    type: Number,
    required: true
  }
})

const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const loading = ref(false)
// local optimistic state: null = no override, true/false = override displayed state
const localFavorited = ref(null)

const isFavorited = computed(() => {
  return favoritesStore.isFavorited(props.bookId)
})

const displayedFavorited = computed(() => {
  return localFavorited.value === null ? isFavorited.value : localFavorited.value
})

const handleToggle = async () => {
  // 檢查是否登入
  if (!authStore.isAuthenticated) {
    alert('請先登入')
    return
  }

  // optimistic UI: flip locally immediately
  localFavorited.value = !isFavorited.value

  try {
    loading.value = true
    await favoritesStore.toggleFavorite(props.bookId)
    // 成功後清除 local override，讓 store 的真實值決定顯示
    localFavorited.value = null
  } catch (error) {
    // 出錯則回滾顯示
    localFavorited.value = null
    alert('操作失敗：' + (error.message || error))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 如果已登入且尚未載入收藏列表，則載入
  if (authStore.isAuthenticated && favoritesStore.favoriteBookIds.size === 0) {
    favoritesStore.fetchFavoriteBookIds()
  }
})
</script>

<style scoped>
.favorite-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 8px;
  color: #ffc0cb;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.favorite-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.favorite-btn.is-favorited {
  color: #ff1744;
}

.favorite-btn i {
  transition: all 0.3s;
}
</style>
