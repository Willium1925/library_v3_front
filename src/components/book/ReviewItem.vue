<template>
  <div class="review-item">
    <div class="review-header">
      <div class="reviewer-info">
        <div class="avatar">
          <i class="fa-solid fa-user"></i>
        </div>
        <div class="reviewer-details">
          <span class="reviewer-name">{{ review.userName }}</span>
          <div class="review-meta">
            <span class="review-rating">
              <i
                v-for="star in 5"
                :key="star"
                class="fa-solid fa-star"
                :class="{ active: star <= review.rating }"
              ></i>
            </span>
            <span class="review-date">{{ formatDate(review.createdAt) }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="isOwnReview" class="review-actions">
        <button @click="handleEdit" class="action-icon">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button @click="handleDelete" class="action-icon">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
    
    <div class="review-content">
      {{ review.reviewText }}
    </div>
    
    <div class="review-footer">
      <button
        class="like-btn"
        :class="{ liked: review.userLiked }"
        @click="handleLike"
      >
        <i :class="review.userLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
        {{ review.likesCount }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  review: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['like', 'edit', 'delete'])

const authStore = useAuthStore()

const isOwnReview = computed(() => {
  return authStore.user?.id === props.review.userId
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  
  if (diff < 60) return '剛剛'
  if (diff < 3600) return `${Math.floor(diff / 60)} 分鐘前`
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小時前`
  if (diff < 604800) return `${Math.floor(diff / 86400)} 天前`
  
  return date.toLocaleDateString('zh-TW')
}

const handleLike = () => {
  emit('like', props.review.id)
}

const handleEdit = () => {
  emit('edit', props.review)
}

const handleDelete = () => {
  if (confirm('確定要刪除這則評論嗎？')) {
    emit('delete', props.review.id)
  }
}
</script>

<style scoped>
.review-item {
  background: #fff;
  border: 1px solid var(--light-border);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  transition: box-shadow 0.3s;
}

.review-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.reviewer-info {
  display: flex;
  gap: 15px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray);
}

.reviewer-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.reviewer-name {
  font-weight: 700;
  font-size: 14px;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--gray);
}

.review-rating {
  color: #ffa500;
  font-size: 12px;
}

.review-rating i {
  color: #ddd;
}

.review-rating i.active {
  color: #ffa500;
}

.review-actions {
  display: flex;
  gap: 10px;
}

.action-icon {
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  color: var(--gray);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.action-icon:hover {
  background: var(--light-gray);
  color: var(--primary);
}

.review-content {
  font-size: 14px;
  line-height: 1.6;
  color: #444;
  margin-bottom: 15px;
  padding: 10px 0;
}

.review-footer {
  display: flex;
  justify-content: flex-start;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--light-border);
  background: #fff;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.like-btn:hover {
  background: #f9f9f9;
  border-color: var(--accent);
}

.like-btn.liked {
  background: #ffe0e0;
  border-color: var(--accent);
  color: var(--accent);
}

.like-btn i {
  color: inherit;
}
</style>

