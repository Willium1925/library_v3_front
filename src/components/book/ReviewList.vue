<template>
  <div class="reviews-section">
    <div class="section-header">
      <h3 class="section-head">讀者評論</h3>
      <button v-if="isAuthenticated" @click="showReviewForm = !showReviewForm" class="add-review-btn">
        <i class="fa-solid fa-plus"></i>
        撰寫評論
      </button>
    </div>
    
    <!-- Review Form -->
    <div v-if="showReviewForm" class="review-form">
      <h4>{{ editingReview ? '編輯評論' : '撰寫評論' }}</h4>
      <div class="rating-input">
        <label>評分：</label>
        <div class="stars-input">
          <i
            v-for="star in 5"
            :key="star"
            class="fa-star"
            :class="star <= formData.rating ? 'fa-solid active' : 'fa-regular'"
            @click="formData.rating = star"
          ></i>
        </div>
      </div>
      <textarea
        v-model="formData.reviewText"
        placeholder="分享你的讀後感想..."
        rows="5"
      ></textarea>
      <div class="form-actions">
        <button @click="handleSubmit" class="submit-btn">送出</button>
        <button @click="handleCancel" class="cancel-btn">取消</button>
      </div>
    </div>
    
    <!-- Reviews List -->
    <div v-if="reviews.length > 0" class="reviews-list">
      <ReviewItem
        v-for="review in reviews"
        :key="review.id"
        :review="review"
        @like="handleLike"
        @edit="handleEditReview"
        @delete="handleDeleteReview"
      />
    </div>
    
    <div v-else class="no-reviews">
      <i class="fa-regular fa-comments"></i>
      <p>尚無評論，成為第一個評論者！</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { reviewsAPI } from '../../api/reviews'
import ReviewItem from './ReviewItem.vue'

const props = defineProps({
  bookId: {
    type: Number,
    required: true
  }
})

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const reviews = ref([])
const showReviewForm = ref(false)
const editingReview = ref(null)

const formData = reactive({
  rating: 5,
  reviewText: ''
})

const fetchReviews = async () => {
  try {
    const res = await reviewsAPI.getByBookId(props.bookId)
    // 支援 axios 回傳的 res.data 或直接回傳陣列/物件
    const data = res?.data ?? res
    // 如果是分頁物件，取 content；否則嘗試直接使用陣列
    reviews.value = Array.isArray(data)
        ? data
        : (data.content ?? [])
  } catch (error) {
    console.error('獲取評論失敗:', error)
    reviews.value = []
  }
}

const handleSubmit = async () => {
  if (!formData.reviewText.trim()) {
    alert('請填寫評論內容')
    return
  }
  
  try {
    if (editingReview.value) {
      await reviewsAPI.updateReview(props.bookId, editingReview.value.id, formData)
    } else {
      await reviewsAPI.addReview(props.bookId, formData)
    }
    
    alert('評論成功！')
    showReviewForm.value = false
    editingReview.value = null
    formData.rating = 5
    formData.reviewText = ''
    
    await fetchReviews()
  } catch (error) {
    alert('評論失敗：' + error)
  }
}

const handleCancel = () => {
  showReviewForm.value = false
  editingReview.value = null
  formData.rating = 5
  formData.reviewText = ''
}

const handleLike = async (reviewId) => {
  try {
    const review = reviews.value.find(r => r.id === reviewId)
    if (review.userLiked) {
      await reviewsAPI.unlikeReview(props.bookId, reviewId)
    } else {
      await reviewsAPI.likeReview(props.bookId, reviewId)
    }
    await fetchReviews()
  } catch (error) {
    console.error('按讚失敗:', error)
  }
}

const handleEditReview = (review) => {
  editingReview.value = review
  formData.rating = review.rating
  formData.reviewText = review.reviewText
  showReviewForm.value = true
}

const handleDeleteReview = async (reviewId) => {
  try {
    await reviewsAPI.deleteReview(props.bookId, reviewId)
    alert('刪除成功')
    await fetchReviews()
  } catch (error) {
    alert('刪除失敗：' + error)
  }
}

onMounted(() => {
  fetchReviews()
})
</script>

<style scoped>
.reviews-section {
  margin-bottom: 60px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-head {
  font-size: 24px;
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.section-head::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 24px;
  background: var(--accent);
  margin-right: 15px;
}

.add-review-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.add-review-btn:hover {
  background: var(--gray);
}

.review-form {
  background: #fff;
  border: 1px solid var(--light-border);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.review-form h4 {
  font-size: 18px;
  margin-bottom: 15px;
}

.rating-input {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.stars-input {
  display: flex;
  gap: 5px;
  font-size: 24px;
}

.stars-input i {
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s;
}

.stars-input i:hover,
.stars-input i.active {
  color: #ffa500;
}

.review-form textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--light-border);
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 15px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.submit-btn,
.cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn {
  background: var(--primary);
  color: #fff;
}

.submit-btn:hover {
  background: var(--gray);
}

.cancel-btn {
  background: #f0f0f0;
  color: var(--primary);
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.reviews-list {
  display: flex;
  flex-direction: column;
}

.no-reviews {
  text-align: center;
  padding: 60px 20px;
  color: var(--gray);
  background: #f9f9f9;
  border: 1px dashed var(--light-border);
  border-radius: 8px;
}

.no-reviews i {
  font-size: 60px;
  margin-bottom: 15px;
  opacity: 0.5;
}

.no-reviews p {
  font-size: 16px;
}
</style>

