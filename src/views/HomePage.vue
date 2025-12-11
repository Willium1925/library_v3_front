<template>
  <div class="home-page">
    <TheHeader />
    
    <!-- Hero Banner -->
    <section class="hero">
      <div class="hero-text">歡迎來到圖書館系統</div>
    </section>
    
    <!-- Category Navigation -->
    <nav class="cat-nav">
      <!-- Main Categories -->
      <ul class="main-cats">
        <li
          v-for="category in mainCategories"
          :key="category.id"
          class="main-cats__item"
          :class="{ active: selectedMainCategory === category.id }"
          @click="selectMainCategory(category.id)"
        >
          {{ category.categoryTitle }}
        </li>
      </ul>
      
      <!-- Sub Categories -->
      <div class="sub-cats">
        <div
          v-for="subCat in currentSubCategories"
          :key="subCat.id"
          class="sub-cats__item"
          @click="goToSearch(subCat.id)"
        >
          {{ subCat.categorySubTitle }}
        </div>
      </div>
    </nav>
    
    <!-- Latest Books Section -->
    <section class="section-container">
      <div class="section-header">
        <h2 class="section-title">
          NEW ARRIVALS
          <span class="section-subtitle">最新上架</span>
        </h2>
        <router-link to="/search?sort=addedDate,desc" class="section-more">
          查看更多
        </router-link>
      </div>
      <BookGrid v-if="!loading.latest" :books="latestBooks" :columns="5" />
      <div v-else class="loading">載入中...</div>
    </section>
    
    <!-- Popular Books Section -->
    <section class="section-container section-popular">
      <div class="section-header">
        <h2 class="section-title">
          POPULAR
          <span class="section-subtitle">熱門借閱</span>
        </h2>
        <router-link to="/search?sort=totalLoanCount,desc" class="section-more">
          查看排行榜
        </router-link>
      </div>
      <BookGrid v-if="!loading.popular" :books="popularBooks" :columns="5" />
      <div v-else class="loading">載入中...</div>
    </section>
    
    <!-- Tags Cloud Section -->
    <section class="section-container">
      <div class="section-header">
        <h2 class="section-title">
          TAGS
          <span class="section-subtitle">熱門標籤</span>
        </h2>
      </div>
      <TagCloud v-if="!loading.tags" :tags="popularTags" />
      <div v-else class="loading">載入中...</div>
    </section>
    
    <footer class="footer">
      <p>&copy; 2025 Library System. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import TheHeader from '../components/common/TheHeader.vue'
import BookGrid from '../components/book/BookGrid.vue'
import TagCloud from '../components/filter/TagCloud.vue'
import { booksAPI } from '../api/books'
import { categoriesAPI } from '../api/categories'
import { tagsAPI } from '../api/tags'

const router = useRouter()

// 從後端獲取的分類資料
const mainCategories = ref([])
const selectedMainCategory = ref(null)

const currentSubCategories = computed(() => {
  if (!selectedMainCategory.value) return []
  const selectedCategory = mainCategories.value.find(cat => cat.id === selectedMainCategory.value)
  return selectedCategory?.categorySubs || []
})

const latestBooks = ref([])
const popularBooks = ref([])
const popularTags = ref([])

const loading = reactive({
  latest: false,
  popular: false,
  tags: false
})

const selectMainCategory = (categoryId) => {
  selectedMainCategory.value = categoryId
}

const goToSearch = (subCategoryId) => {
  router.push({
    path: '/search',
    query: { 
      mainCategoryId: selectedMainCategory.value,
      subCategoryId: subCategoryId 
    }
  })
}

const fetchLatestBooks = async (categoryId = null) => {
  try {
    loading.latest = true
    const response = await booksAPI.getTop5New(categoryId)
    latestBooks.value = response
  } catch (error) {
    console.error('獲取最新書籍失敗:', error)
    latestBooks.value = []
  } finally {
    loading.latest = false
  }
}

const fetchPopularBooks = async (categoryId = null) => {
  try {
    loading.popular = true
    const response = await booksAPI.getTop5Loan(categoryId)
    popularBooks.value = response
  } catch (error) {
    console.error('獲取熱門書籍失敗:', error)
    popularBooks.value = []
  } finally {
    loading.popular = false
  }
}

const fetchPopularTags = async (categoryId = null) => {
  try {
    loading.tags = true
    const response = await tagsAPI.getTop10(categoryId)
    popularTags.value = response
  } catch (error) {
    console.error('獲取熱門標籤失敗:', error)
    popularTags.value = []
  } finally {
    loading.tags = false
  }
}

const fetchCategories = async () => {
  try {
    const categories = await categoriesAPI.getAll()
    mainCategories.value = categories
    
    // 預設選擇第一個主分類
    if (mainCategories.value.length > 0) {
      selectedMainCategory.value = mainCategories.value[0].id
    }
  } catch (error) {
    console.error('獲取分類失敗:', error)
  }
}

// 監聽主分類變化，更新書籍列表（跳過初始值，避免重複呼叫）
watch(selectedMainCategory, (newCategoryId, oldCategoryId) => {
  if (newCategoryId && oldCategoryId !== undefined) {
    fetchLatestBooks(newCategoryId)
    fetchPopularBooks(newCategoryId)
    fetchPopularTags(newCategoryId)
  }
})

onMounted(async () => {
  await fetchCategories()
  // 初始載入時，手動觸發一次資料獲取
  if (selectedMainCategory.value) {
    await fetchLatestBooks(selectedMainCategory.value)
    await fetchPopularBooks(selectedMainCategory.value)
    await fetchPopularTags(selectedMainCategory.value)
  }
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--bg);
}

/* Hero */
.hero {
  height: 400px;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.hero-text {
  font-size: 40px;
  font-family: 'Noto Serif TC', serif;
  letter-spacing: 5px;
  opacity: 0.3;
}

/* Category Navigation */
.cat-nav {
  background: #fff;
  border-bottom: 1px solid var(--border-color);
}

.main-cats {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #eee;
}

.main-cats__item {
  padding: 20px 40px;
  cursor: pointer;
  font-weight: 700;
  font-size: 18px;
  border-bottom: 3px solid transparent;
  transition: 0.3s;
  color: #1a1a1a !important;
}

.main-cats__item.active {
  border-bottom: 3px solid #1a1a1a;
}

.main-cats__item:hover {
  color: #888 !important;
}

.sub-cats {
  display: flex;
  justify-content: center;
  background: #f4f4f4;
  padding: 15px 0;
  min-height: 50px;
  flex-wrap: wrap;
}

.sub-cats__item {
  margin: 5px 15px;
  font-size: 14px;
  padding: 5px 15px;
  border: 1px solid #1a1a1a;
  border-radius: 20px;
  background: #fff;
  color: #1a1a1a;
  cursor: pointer;
  transition: 0.2s;
}

.sub-cats__item:hover {
  background: #1a1a1a;
  color: #fff !important;
}

/* Sections */
.section-container {
  padding: 60px 80px;
  max-width: 1600px;
  margin: 0 auto;
}

.section-popular {
  background: #fff;
  padding: 40px 80px;
  border: 1px solid #000;
  box-shadow: 10px 10px 0 #ddd;
  margin: 60px auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 2px solid #ddd;
  padding-bottom: 15px;
  margin-bottom: 30px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  font-family: 'Noto Serif TC', serif;
  letter-spacing: 3px;
}

.section-subtitle {
  font-size: 14px;
  color: var(--gray);
  font-weight: 400;
  font-family: 'Noto Sans TC', sans-serif;
}

.section-more {
  font-size: 14px;
  color: var(--gray);
  cursor: pointer;
  transition: color 0.2s;
}

.section-more:hover {
  color: var(--primary);
}

.loading {
  text-align: center;
  padding: 40px;
  color: var(--gray);
}

/* Footer */
.footer {
  background: var(--primary);
  color: #fff;
  padding: 40px;
  text-align: center;
  margin-top: 100px;
}
</style>

