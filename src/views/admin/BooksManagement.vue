<template>
  <div class="books-management">
    <div class="page-header">
      <h2 class="page-title">書籍管理</h2>
      <button class="btn btn-primary" @click="showCreateModal">
        <i class="fa-solid fa-plus"></i>
        新增書籍
      </button>
    </div>

    <!-- 篩選區 -->
    <div class="filter-section">
      <div class="filter-row">
        <select v-model="filters.mainCategoryId" @change="onMainCategoryChange">
          <option :value="null">所有主分類</option>
          <option v-for="cat in mainCategories" :key="cat.id" :value="cat.id">
            {{ cat.categoryTitle }}
          </option>
        </select>
        <select v-model="filters.subCategoryId" :disabled="!filters.mainCategoryId">
          <option :value="null">所有次分類</option>
          <option v-for="sub in currentSubCategories" :key="sub.id" :value="sub.id">
            {{ sub.categorySubTitle }}
          </option>
        </select>
        <input v-model="filters.keyword" placeholder="書名關鍵字" />
        <input v-model="filters.authorKeyword" placeholder="作者關鍵字" />
        <input v-model="filters.publisherKeyword" placeholder="出版商關鍵字" />
      </div>
      <div class="filter-row">
        <input v-model="filters.isbn" placeholder="ISBN" />
        <input v-model="filters.publishYear" placeholder="出版年份" type="number" />
        <select v-model="sortBy">
          <option value="id,asc">ID 升序</option>
          <option value="id,desc">ID 降序</option>
          <option value="addedDate,desc">最新上架</option>
          <option value="addedDate,asc">最早上架</option>
          <option value="totalLoanCount,desc">借閱次數最多</option>
          <option value="totalLoanCount,asc">借閱次數最少</option>
        </select>
        <div class="filter-actions">
          <button class="btn btn-secondary" @click="clearFilters">清除篩選</button>
          <button class="btn btn-primary" @click="search">執行搜尋</button>
        </div>
      </div>
    </div>

    <!-- 書籍列表 -->
    <div v-if="loading" class="loading">載入中...</div>
    <div v-else-if="books.length === 0" class="no-data">尚無資料</div>
    <div v-else class="books-table">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>書名</th>
            <th>系列</th>
            <th>主分類</th>
            <th>次分類</th>
            <th>作者</th>
            <th>出版年份</th>
            <th>出版商</th>
            <th>ISBN</th>
            <th>代表作</th>
            <th>上架日</th>
            <th>借閱次數</th>
            <th>在館(n/m)</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <td>{{ book.id }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.seriesTitle }}</td>
            <td>{{ book.mainCategoryTitle}}</td>
            <td>{{ book.subCategoryTitle }}</td>
            <td>{{ book.authors?.join('、') || '-' }}</td>
            <td>{{ book.publishYear || '-' }}</td>
            <td>{{ book.publisherName || '-' }}</td>
            <td>{{ book.isbn || '-' }}</td>
            <td>{{ book.representative ? '✓' : '' }}</td>
            <td>{{ formatDate(book.addedDate) }}</td>
            <td>{{ book.totalLoanCount || 0 }}</td>
            <td>{{ book.availableCopies || 0 }} / {{ book.totalCopies || 0 }}</td>
            <td>
              <button class="btn-icon" @click="viewCopies(book)" title="查看副本">
                <i class="fa-solid fa-list"></i>
              </button>
              <button class="btn-icon" @click="editBook(book)" title="編輯">
                <i class="fa-solid fa-edit"></i>
              </button>
              <button class="btn-icon text-danger" @click="deleteBook(book.id)" title="刪除">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分頁控制 -->
    <div v-if="!loading && pagination.totalPages > 0" class="pagination">
      <div class="pagination-info">
        顯示第 {{ pagination.currentPage * pagination.pageSize + 1 }} - 
        {{ Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements) }} 項，
        共 {{ pagination.totalElements }} 項
      </div>
      <div class="pagination-controls">
        <button 
          class="btn btn-secondary" 
          @click="goToPage(0)" 
          :disabled="pagination.currentPage === 0"
        >
          首頁
        </button>
        <button 
          class="btn btn-secondary" 
          @click="goToPage(pagination.currentPage - 1)" 
          :disabled="pagination.currentPage === 0"
        >
          上一頁
        </button>
        <span class="page-number">第 {{ pagination.currentPage + 1 }} / {{ pagination.totalPages }} 頁</span>
        <button 
          class="btn btn-secondary" 
          @click="goToPage(pagination.currentPage + 1)" 
          :disabled="pagination.currentPage >= pagination.totalPages - 1"
        >
          下一頁
        </button>
        <button 
          class="btn btn-secondary" 
          @click="goToPage(pagination.totalPages - 1)" 
          :disabled="pagination.currentPage >= pagination.totalPages - 1"
        >
          末頁
        </button>
      </div>
    </div>

    <!-- 副本列表（條件顯示） -->
    <div v-if="selectedBook && copies.length > 0" class="copies-section">
      <h3>{{ selectedBook.title }} - 副本列表</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>書籍碼</th>
            <th>狀態</th>
            <th>目前借閱者</th>
            <th>借閱日</th>
            <th>到期日</th>
            <th>進貨日</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="copy in copies" :key="copy.id">
            <td>{{ copy.id }}</td>
            <td>{{ copy.uniqueCode }}</td>
            <td>{{ copy.statusDisplay }}</td>
            <td>{{ copy.currentBorrowerAccount || '-' }}</td>
            <td>{{ formatDateTime(copy.loanDate) }}</td>
            <td>{{ formatDate(copy.dueDate) }}</td>
            <td>{{ formatDate(copy.stockedDate) }}</td>
            <td>
              <button class="btn-sm" @click="viewCopyLoans(copy.id)">借閱記錄</button>
              <button class="btn-sm" @click="viewCopyReservations(copy.id)">預約記錄</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 書籍表單 Modal -->
    <BookFormModal
      :is-visible="showBookModal"
      :book-data="selectedBookForEdit"
      :mode="modalMode"
      @close="closeBookModal"
      @success="handleBookSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import adminBooksAPI from '../../api/admin/books'
import { categoriesAPI } from '../../api/categories'
import BookFormModal from '../../components/admin/BookFormModal.vue'

const router = useRouter()

const loading = ref(false)
const books = ref([])
const selectedBook = ref(null)
const copies = ref([])

const mainCategories = ref([])

const showBookModal = ref(false)
const selectedBookForEdit = ref(null)
const modalMode = ref('create') // 'create' or 'edit'

const filters = ref({
  mainCategoryId: null,
  subCategoryId: null,
  keyword: '',
  authorKeyword: '',
  publisherKeyword: '',
  isbn: '',
  publishYear: null
})

const sortBy = ref('id,asc')
const pagination = reactive({
  currentPage: 0,
  pageSize: 10,
  totalPages: 0,
  totalElements: 0
})

const currentSubCategories = computed(() => {
  if (!filters.value.mainCategoryId) return []
  const mainCat = mainCategories.value.find(c => c.id === filters.value.mainCategoryId)
  return mainCat ? mainCat.categorySubs || [] : []
})

const onMainCategoryChange = () => {
  // 當主分類改變時，重置次分類
  filters.value.subCategoryId = null
}

const loadCategories = async () => {
  try {
    mainCategories.value = await categoriesAPI.getAll()
  } catch (error) {
    console.error('載入分類失敗:', error)
  }
}

const search = async (page = 0) => {
  try {
    loading.value = true
    const [sortField, sortDirection] = sortBy.value.split(',')
    
    const params = {
      ...filters.value,
      page,
      size: pagination.pageSize,
      sort: `${sortField},${sortDirection}`
    }
    
    console.log('搜尋參數:', params)
    
    const response = await adminBooksAPI.search(params)
    books.value = response.bookPage.content || []
    
    console.log('後端回傳分頁資訊:', {
      currentPage: response.bookPage.currentPage,
      pageSize: response.bookPage.pageSize,
      totalPages: response.bookPage.totalPages,
      totalElements: response.bookPage.totalElements
    })
    
    // 使用 reactive 對象直接更新（注意：後端是 currentPage 和 pageSize，不是 number 和 size）
    pagination.currentPage = response.bookPage.currentPage ?? 0
    pagination.pageSize = response.bookPage.pageSize ?? 10
    pagination.totalPages = response.bookPage.totalPages ?? 0
    pagination.totalElements = response.bookPage.totalElements ?? 0
    
    console.log('更新後的 pagination:', JSON.parse(JSON.stringify(pagination)))
  } catch (error) {
    alert('搜尋失敗：' + error)
  } finally {
    loading.value = false
  }
}

const goToPage = (page) => {
  console.log('goToPage 被調用，目標頁:', page, '當前頁:', pagination.currentPage)
  if (page >= 0 && page < pagination.totalPages) {
    search(page)
  }
}

const clearFilters = () => {
  filters.value = {
    mainCategoryId: null,
    subCategoryId: null,
    keyword: '',
    authorKeyword: '',
    publisherKeyword: '',
    isbn: '',
    publishYear: null
  }
  search()
}

const showCreateModal = () => {
  modalMode.value = 'create'
  selectedBookForEdit.value = null
  showBookModal.value = true
}

const editBook = async (book) => {
  try {
    // 獲取完整書籍資料（包含副本）
    const fullBookData = await adminBooksAPI.getById(book.id)
    modalMode.value = 'edit'
    selectedBookForEdit.value = fullBookData
    showBookModal.value = true
  } catch (error) {
    alert('獲取書籍資料失敗：' + error)
  }
}

const closeBookModal = () => {
  showBookModal.value = false
  selectedBookForEdit.value = null
}

const handleBookSuccess = () => {
  search() // 重新載入書籍列表
}

const deleteBook = async (id) => {
  if (!confirm('確定要刪除此書籍嗎？')) return
  
  try {
    await adminBooksAPI.delete(id)
    alert('刪除成功')
    search()
  } catch (error) {
    alert('刪除失敗：' + error)
  }
}

const viewCopies = async (book) => {
  selectedBook.value = book
  try {
    copies.value = await adminBooksAPI.getCopies(book.id)
  } catch (error) {
    alert('查詢副本失敗：' + error)
  }
}

const viewCopyLoans = (copyId) => {
  window.open(`/admin/copy/${copyId}/loans`, '_blank')
}

const viewCopyReservations = (copyId) => {
  window.open(`/admin/copy/${copyId}/reservations`, '_blank')
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-TW')
}

const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-TW')
}

// 初始載入
onMounted(() => {
  loadCategories()
  search()
})
</script>

<style scoped>
.books-management {
  max-width: 1400px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--primary);
}

.filter-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.filter-row select,
.filter-row input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.filter-row select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.filter-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn, .btn-sm {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
  margin: 0 2px;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  color: #6b7280;
  transition: color 0.2s;
}

.btn-icon:hover {
  color: var(--primary);
}

.btn-icon.text-danger:hover {
  color: #ef4444;
}

.books-table, .copies-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.copies-section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th {
  background-color: #f9fafb;
  padding: 10px 8px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
}

.data-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
}

.loading, .no-data {
  background: white;
  padding: 40px;
  text-align: center;
  border-radius: 8px;
  color: #6b7280;
}

.pagination {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-info {
  color: #6b7280;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.page-number {
  padding: 0 16px;
  font-weight: 500;
  color: #374151;
}
</style>

