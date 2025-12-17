<template>
  <div class="book-detail-page">
    <TheHeader />
    
    <div v-if="!loading && book" class="container">
      <!-- Back Button -->
      <nav class="nav-bar">
        <a @click="goBack" class="back-btn">
          <i class="fa-solid fa-arrow-left"></i>
          返回
        </a>
      </nav>
      
      <!-- Book Hero Section -->
      <section class="book-hero">
        <!-- Left: Book Cover -->
        <div class="book-cover">
          <img
            :src="book.imageUrl || 'https://placehold.co/350x500/eee/333?text=No+Cover'"
            :alt="book.title"
          />
          <div class="favorite-overlay">
            <FavoriteButton :book-id="book.id" />
          </div>
        </div>
        
        <!-- Right: Book Details -->
        <div class="book-details">
          <div class="book-header-row">
            <div class="book-title-group">
              <h1 class="book-title">{{ book.title }}</h1>
              <p class="book-author">
                作者：
                <span
                  v-for="(author, index) in book.authors"
                  :key="author.id"
                  @click.stop="goToSearch('authorId', author.id)"
                  class="clickable-meta"
                >
                  {{ author.name }}{{ index < book.authors.length - 1 ? '、' : '' }}
                </span>
              </p>
            </div>
            <div class="rating-box">
              <span :class="['rating-score', { 'large-yellow': book.averageRating !== undefined && book.averageRating !== null }]">
                    {{ book.averageRating !== undefined && book.averageRating !== null ? book.averageRating : '尚無' }}
              </span>
              <div class="rating-stars">
                <i v-for="star in 5"
                  :key="star"
                  class="fa-solid fa-star"
                  :class="{ active: star <= Math.round(book.averageRating) }"
                ></i>
              </div>
            </div>
          </div>
          
          <!-- Meta Information -->
          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">ISBN:</span>
              <span class="meta-value">{{ book.isbn }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">出版社:</span>
              <span class="meta-value">{{ book.publisher }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">出版年份:</span>
              <span class="meta-value">{{ book.publishYear }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">上架日期:</span>
              <span class="meta-value">{{ formatDate(book.addedDate) }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">分類:</span>
              <span class="meta-value">
                <span class="clickable-meta" @click="goToSearch('mainCategoryId', book.mainCategoryId)">{{ book.mainCategoryTitle }}</span>
                >
                <span class="clickable-meta" @click="goToSearch('subCategoryId', book.subCategoryId)">{{ book.subCategoryTitle }}</span>
              </span>
            </div>
          </div>
          
          <!-- Tags -->
          <div v-if="book.tags && book.tags.length > 0" class="tags-row">
            <div v-for="tag in book.tags"
                :key="tag.id"
                class="tag"
                @click.stop="goToSearch('tags', tag.id)"
            >
              {{ tag.title }}
            </div>
          </div>
          
          <!-- Description -->
          <div v-if="book.description" class="book-desc">
            {{ book.description }}
          </div>
        </div>
      </section>
      
      <!-- Holdings Table -->
      <HoldingsTable
        :copies="bookCopies"
        @reserve-success="handleReserveSuccess"
      />
      
      <!-- Reviews Section -->
      <ReviewList :bookId="bookId" />
    </div>
    
    <!-- Loading -->
    <div v-else-if="loading" class="loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>載入中...</p>
    </div>
    
    <!-- Error -->
    <div v-else class="error">
      <i class="fa-solid fa-exclamation-circle"></i>
      <p>找不到此書籍</p>
      <button @click="goBack" class="back-btn-error">返回</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooksStore } from '../stores/books'
import TheHeader from '../components/common/TheHeader.vue'
import HoldingsTable from '../components/book/HoldingsTable.vue'
import ReviewList from '../components/book/ReviewList.vue'
import FavoriteButton from "../components/book/FavoriteButton.vue";

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()

const bookId = Number(route.params.id)
const loading = ref(false)
const book = ref(null)
const bookCopies = ref([])

const fetchBookDetail = async () => {
  try {
    loading.value = true
    const response = await booksStore.fetchBookById(bookId)
    book.value = response
    bookCopies.value = response.bookCopies || []
  } catch (error) {
    console.error('獲取書籍詳情失敗:', error)
    book.value = null
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const goToSearch = (filterType, filterValue) => {
  if (!filterType || !filterValue) return;
  router.push({
    path: '/search',
    query: { [filterType]: filterValue }
  })
}

const goBack = () => {
  router.back()
}

const handleReserveSuccess = () => {
  // 重新載入書籍詳情以更新館藏資訊
  fetchBookDetail()
}

onMounted(() => {
  fetchBookDetail()
})
</script>

<style scoped>
.book-detail-page {
  min-height: 100vh;
  background: var(--bg);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 80px;
}

/* Navigation */
.nav-bar {
  margin: 30px 0;
  display: flex;
  align-items: center;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  color: var(--gray);
  transform: translateX(-5px);
}

/* Book Hero */
.book-hero {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 50px;
  margin-bottom: 60px;
  background: #fff;
  padding: 40px;
  border: 1px solid var(--border-color);
  box-shadow: 10px 10px 0 rgba(0, 0, 0, 0.05);
}

.book-cover {
  width: 100%;
  aspect-ratio: 2/3;
  background: #eee;
  position: relative;
  border: 1px solid #ddd;
  overflow: hidden;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  opacity: 1; /* always visible */
  transition: opacity 0.3s;
  padding: 6px;
}

.book-details {
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Book Header */
.book-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  border-bottom: 2px solid var(--primary);
  padding-bottom: 20px;
}

.book-title-group {
  flex: 1;
  margin-right: 20px;
}

.book-title {
  font-family: 'Noto Serif TC', serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 10px;
}

.book-author {
  font-size: 18px;
  color: var(--gray);
  font-weight: 500;
}

/* Rating Box */
.rating-box {
  background: var(--gray);
  color: #fff;
  padding: 15px 20px;
  text-align: center;
  min-width: 100px;
  border-radius: 8px;
}

.rating-score {
  font-size: 28px;
  font-weight: 700;
  display: block;
}

.rating-stars {
  font-size: 12px;
  color: #ffd700;
  margin-top: 5px;
}
.rating-score.large-yellow {
  color: #ffd700;
  font-size: 45px;
  font-weight: 800;
}

.rating-stars i {
  color: #cacaca;
}

.rating-stars i.active {
  color: #ffd700;
}

.rating-count {
  font-size: 11px;
  color: #ccc;
  display: block;
  margin-top: 5px;
}

/* Meta Grid */
.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px 30px;
  margin-bottom: 30px;
  font-size: 14px;
}

.meta-item {
  display: flex;
}

.meta-label {
  font-weight: 700;
  width: 90px;
  color: var(--gray);
}

.meta-value {
  font-weight: 500;
}

.clickable-meta {
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: all 0.2s;
}

.clickable-meta:hover {
  color: var(--primary);
  text-decoration-color: var(--primary);
}

/* Tags */
.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

.tag {
  font-size: 12px;
  padding: 6px 12px;
  border: 1px solid var(--primary);
  background: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 2px 2px 0 var(--primary);
}

.tag:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 var(--primary);
}

/* Description */
.book-desc {
  font-size: 15px;
  line-height: 1.8;
  color: #444;
  background: #f4f4f4;
  padding: 20px;
  border-left: 4px solid var(--primary);
  margin-top: auto;
}

/* Loading & Error */
.loading,
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: var(--gray);
}

.loading i,
.error i {
  font-size: 60px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.loading p,
.error p {
  font-size: 18px;
  margin-bottom: 20px;
}

.back-btn-error {
  padding: 10px 30px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn-error:hover {
  background: var(--gray);
}

/* Responsive */
@media (max-width: 992px) {
  .book-hero {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .book-cover {
    max-width: 350px;
    margin: 0 auto;
  }
}
</style>
