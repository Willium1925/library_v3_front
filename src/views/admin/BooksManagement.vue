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
        <input v-model="filters.keyword" placeholder="書名關鍵字" />
        <input v-model="filters.authorKeyword" placeholder="作者關鍵字" />
        <input v-model="filters.publisherKeyword" placeholder="出版商關鍵字" />
        <input v-model="filters.isbn" placeholder="ISBN" />
        <input v-model="filters.publishYear" placeholder="出版年份" type="number" />
      </div>
      <div class="filter-actions">
        <button class="btn btn-secondary" @click="clearFilters">清除篩選</button>
        <button class="btn btn-primary" @click="search">執行搜尋</button>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import adminBooksAPI from '../../api/admin/books'

const router = useRouter()

const loading = ref(false)
const books = ref([])
const selectedBook = ref(null)
const copies = ref([])

const filters = ref({
  keyword: '',
  authorKeyword: '',
  publisherKeyword: '',
  isbn: '',
  publishYear: null
})

const search = async () => {
  try {
    loading.value = true
    const response = await adminBooksAPI.search(filters.value)
    books.value = response.books || []
  } catch (error) {
    alert('搜尋失敗：' + error)
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  filters.value = {
    keyword: '',
    authorKeyword: '',
    publisherKeyword: '',
    isbn: '',
    publishYear: null
  }
  search()
}

const showCreateModal = () => {
  alert('新增書籍功能開發中')
}

const editBook = (book) => {
  alert('編輯書籍功能開發中：' + book.title)
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
search()
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

.filter-row input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
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
</style>

