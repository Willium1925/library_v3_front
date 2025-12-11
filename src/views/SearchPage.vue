<template>
  <div class="search-page">
    <TheHeader />
    
    <div class="layout-container">
      <!-- Sidebar -->
      <FilterSidebar
        :mainCategories="filterOptions.mainCategories"
        :subCategories="filterOptions.subCategories"
        :authors="filterOptions.authors"
        :publishers="filterOptions.publishers"
        :tags="filterOptions.tags"
        :initialFilters="filters"
        @filter-change="handleFilterChange"
      />
      
      <!-- Main Content -->
      <main class="main-content">
        <!-- Toolbar -->
        <div class="toolbar">
          <div class="toolbar-left">
            <span class="result-count">找到 {{ pagination.totalElements }} 本書</span>
          </div>
          <div class="toolbar-right">
            <label class="sort-label">
              排序：
              <select v-model="sortOption" @change="handleSortChange">
                <option value="addedDate,desc">上架日期 (新到舊)</option>
                <option value="addedDate,asc">上架日期 (舊到新)</option>
                <option value="totalLoanCount,desc">熱門借閱</option>
                <option value="totalLoanCount,asc">冷門借閱</option>
                <option value="title,asc">書名 (A-Z)</option>
                <option value="title,desc">書名 (Z-A)</option>
              </select>
            </label>
            
            <div class="series-display-toggle">
              <button
                :class="['toggle-btn', { active: !filters.seriesDisplay }]"
                @click="toggleSeriesDisplay(false)"
              >
                全部書籍
              </button>
              <button
                :class="['toggle-btn', { active: filters.seriesDisplay }]"
                @click="toggleSeriesDisplay(true)"
              >
                僅系列作
              </button>
            </div>
          </div>
        </div>
        
        <!-- Book Grid -->
        <div v-if="!loading && books.length > 0">
          <BookGrid :books="books" :columns="4" :show-status="true" />
        </div>
        
        <!-- Loading -->
        <div v-else-if="loading" class="loading">
          <i class="fa-solid fa-spinner fa-spin"></i>
          <p>搜尋中...</p>
        </div>
        
        <!-- No Results -->
        <div v-else class="no-results">
          <i class="fa-regular fa-folder-open"></i>
          <p>找不到符合條件的書籍</p>
          <p class="hint">試著調整篩選條件或關鍵字</p>
        </div>
        
        <!-- Pagination -->
        <div v-if="books.length > 0" class="pagination">
          <button
            class="page-btn"
            :disabled="pagination.currentPage === 0"
            @click="goToPage(pagination.currentPage - 1)"
          >
            <i class="fa-solid fa-chevron-left"></i>
            上一頁
          </button>
          
          <div class="page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              class="page-number"
              :class="{ active: page === pagination.currentPage }"
              @click="goToPage(page)"
            >
              {{ page + 1 }}
            </button>
          </div>
          
          <button
            class="page-btn"
            :disabled="pagination.currentPage >= pagination.totalPages - 1"
            @click="goToPage(pagination.currentPage + 1)"
          >
            下一頁
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooksStore } from '../stores/books'
import { categoriesAPI } from '../api/categories'
import TheHeader from '../components/common/TheHeader.vue'
import FilterSidebar from '../components/filter/FilterSidebar.vue'
import BookGrid from '../components/book/BookGrid.vue'

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()

const loading = ref(false)
const books = ref([])
const pagination = reactive({
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  pageSize: 20
})

const filters = reactive({
  keyword: '',
  mainCategoryId: null,
  subCategoryId: null,
  authorId: null,
  publisherId: null,
  tags: [],
  seriesDisplay: null
})

const sortOption = ref('addedDate,desc')

// 從後端獲取的篩選選項
const filterOptions = reactive({
  mainCategories: [],
  subCategories: [],
  authors: [],
  publishers: [],
  tags: []
})

// 計算可見的頁碼範圍
const visiblePages = computed(() => {
  const total = pagination.totalPages
  const current = pagination.currentPage
  const range = 2 // 當前頁左右各顯示2頁
  
  let start = Math.max(0, current - range)
  let end = Math.min(total - 1, current + range)
  
  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const handleFilterChange = (newFilters) => {
  Object.assign(filters, newFilters)
  updateURL()
  searchBooks()
}

const handleSortChange = () => {
  updateURL()
  searchBooks()
}

const toggleSeriesDisplay = (value) => {
  filters.seriesDisplay = value ? 1 : null
  updateURL()
  searchBooks()
}

const goToPage = (page) => {
  pagination.currentPage = page
  updateURL()
  searchBooks()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const updateURL = () => {
  const query = {
    ...filters,
    page: pagination.currentPage,
    size: pagination.pageSize,
    sort: sortOption.value
  }
  
  // 移除空值
  Object.keys(query).forEach(key => {
    if (query[key] === null || query[key] === '' || 
        (Array.isArray(query[key]) && query[key].length === 0)) {
      delete query[key]
    }
  })
  
  router.push({ query })
}

const parseURLParams = () => {
  const query = route.query
  
  filters.keyword = query.keyword || ''
  filters.mainCategoryId = query.mainCategoryId ? Number(query.mainCategoryId) : null
  filters.subCategoryId = query.subCategoryId ? Number(query.subCategoryId) : null
  filters.authorId = query.authorId ? Number(query.authorId) : null
  filters.publisherId = query.publisherId ? Number(query.publisherId) : null
  filters.tags = query.tags ? (Array.isArray(query.tags) ? query.tags.map(Number) : [Number(query.tags)]) : []
  filters.seriesDisplay = query.seriesDisplay ? Number(query.seriesDisplay) : null
  
  pagination.currentPage = query.page ? Number(query.page) : 0
  pagination.pageSize = query.size ? Number(query.size) : 20
  sortOption.value = query.sort || 'addedDate,desc'
}

const searchBooks = async () => {
  try {
    loading.value = true
    
    const searchParams = {
      ...filters,
      page: pagination.currentPage,
      size: pagination.pageSize,
      sort: sortOption.value
    }
    
    const response = await booksStore.searchBooks(searchParams)
    
    books.value = response.bookPage.content
    pagination.currentPage = response.bookPage.currentPage
    pagination.totalPages = response.bookPage.totalPages
    pagination.totalElements = response.bookPage.totalElements
    pagination.pageSize = response.bookPage.pageSize
    
    // 更新篩選選項的數量（從 stats 獲取）
    if (response.stats) {
      updateFilterOptionsFromStats(response.stats)
    }
    
  } catch (error) {
    console.error('搜尋書籍失敗:', error)
    books.value = []
  } finally {
    loading.value = false
  }
}

const updateFilterOptionsFromStats = (stats) => {
  // TODO: 根據 stats 更新篩選選項的 count
  // 這個功能需要後端提供統計資料
}

const fetchFilterOptions = async () => {
  try {
    const categories = await categoriesAPI.getAll()
    
    filterOptions.mainCategories = categories
    // 從所有主分類中提取所有子分類
    filterOptions.subCategories = categories.flatMap(cat => cat.categorySubs || [])
    
    // TODO: 獲取作者、出版社、標籤列表
    // 暫時使用空陣列，待後端 API 實作
    filterOptions.authors = []
    filterOptions.publishers = []
    filterOptions.tags = []
  } catch (error) {
    console.error('獲取篩選選項失敗:', error)
  }
}

// 監聽路由變化
watch(() => route.query, () => {
  parseURLParams()
  searchBooks()
}, { deep: true })

onMounted(async () => {
  await fetchFilterOptions()
  parseURLParams()
  searchBooks()
})
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: var(--bg);
}

.layout-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  max-width: 1600px;
  margin: 40px auto;
  padding: 0 20px;
  min-height: calc(100vh - 80px);
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #fff;
  border: 1px solid var(--light-border);
  border-radius: 8px;
}

.result-count {
  font-weight: 500;
  color: var(--gray);
}

.sort-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--primary);
}

.sort-label select {
  padding: 8px 12px;
  border: 1px solid var(--light-border);
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
}

.series-display-toggle {
  display: flex;
  gap: 0;
  border: 1px solid var(--light-border);
  border-radius: 4px;
  overflow: hidden;
}

.toggle-btn {
  padding: 8px 16px;
  background: #fff;
  color: var(--primary);
  border: none;
  border-right: 1px solid var(--light-border);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.toggle-btn:last-child {
  border-right: none;
}

.toggle-btn:hover {
  background: #f0f0f0;
}

.toggle-btn.active {
  background: var(--primary);
  color: #fff;
}

/* Loading & No Results */
.loading,
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  color: var(--gray);
}

.loading i,
.no-results i {
  font-size: 60px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.loading p,
.no-results p {
  font-size: 18px;
  margin-bottom: 10px;
}

.no-results .hint {
  font-size: 14px;
  color: var(--gray);
  opacity: 0.7;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 40px 0;
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #fff;
  border: 1px solid var(--light-border);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-number {
  min-width: 40px;
  height: 40px;
  background: #fff;
  border: 1px solid var(--light-border);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.page-number:hover {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.page-number.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
  font-weight: 700;
}

/* Responsive */
@media (max-width: 992px) {
  .layout-container {
    grid-template-columns: 1fr;
  }
}
</style>

