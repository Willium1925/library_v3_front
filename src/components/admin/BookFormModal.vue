<template>
  <BaseModal 
    :model-value="isVisible" 
    :title="title" 
    size="large" 
    hide-footer
    @update:model-value="$emit('close')"
    @close="handleClose"
  >
    <div class="book-form">
      <!-- 步驟指示器 -->
      <div class="steps">
        <div class="step" :class="{ active: currentStep === 1 }">
          <span class="step-number">1</span>
          <span class="step-label">書籍資料</span>
        </div>
        <div class="step" :class="{ active: currentStep === 2 }">
          <span class="step-number">2</span>
          <span class="step-label">書籍副本</span>
        </div>
        <div class="step" :class="{ active: currentStep === 3 }">
          <span class="step-number">3</span>
          <span class="step-label">預覽確認</span>
        </div>
      </div>

      <!-- 步驟 1: 書籍資料 -->
      <div v-if="currentStep === 1" class="form-section">
        <h4>書籍基本資料</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>書名 <span class="required">*</span></label>
            <input v-model="formData.title" placeholder="請輸入書名" />
          </div>
          <div class="form-group">
            <label>ISBN</label>
            <input v-model="formData.isbn" placeholder="請輸入 ISBN" />
          </div>
          <div class="form-group">
            <label>出版年份</label>
            <input v-model.number="formData.publishYear" type="number" placeholder="例如：2023" />
          </div>
          <div class="form-group full-width">
            <label>圖片 URL</label>
            <input v-model="formData.imageUrl" placeholder="請輸入圖片網址" />
          </div>
        </div>

        <h4>分類與出版</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>主分類 <span class="required">*</span></label>
            <select v-model="formData.mainCategoryId" @change="onMainCategoryChange">
              <option :value="null">請選擇主分類</option>
              <option v-for="cat in mainCategories" :key="cat.id" :value="cat.id">
                {{ cat.categoryTitle }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>次分類 <span class="required">*</span></label>
            <select v-model="formData.categorySubId" :disabled="!formData.mainCategoryId">
              <option :value="null">請選擇次分類</option>
              <option v-for="sub in currentSubCategories" :key="sub.id" :value="sub.id">
                {{ sub.categorySubTitle }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>出版商 <span class="required">*</span></label>
            <select v-model="formData.publisherId">
              <option :value="null">請選擇出版商</option>
              <option v-for="pub in publishers" :key="pub.id" :value="pub.id">
                {{ pub.pubName }}
              </option>
            </select>
          </div>
        </div>

        <h4>作者與標籤</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>作者 <span class="required">*</span></label>
            <div class="multi-select">
              <input 
                v-model="authorSearch" 
                placeholder="搜尋作者..." 
                @focus="showAuthorDropdown = true"
              />
              <div v-if="showAuthorDropdown" class="dropdown">
                <div 
                  v-for="author in filteredAuthors" 
                  :key="author.id"
                  class="dropdown-item"
                  @click="toggleAuthor(author)"
                >
                  <input type="checkbox" :checked="isAuthorSelected(author.id)" />
                  {{ author.name }}
                </div>
              </div>
            </div>
            <div class="selected-items">
              <span 
                v-for="authorId in formData.authorIds" 
                :key="authorId"
                class="tag"
              >
                {{ getAuthorName(authorId) }}
                <i class="fa-solid fa-times" @click="removeAuthor(authorId)"></i>
              </span>
            </div>
          </div>

          <div class="form-group">
            <label>標籤</label>
            <div class="multi-select">
              <input 
                v-model="tagSearch" 
                placeholder="搜尋標籤..." 
                @focus="showTagDropdown = true"
              />
              <div v-if="showTagDropdown" class="dropdown">
                <div 
                  v-for="tag in filteredTags" 
                  :key="tag.id"
                  class="dropdown-item"
                  @click="toggleTag(tag)"
                >
                  <input type="checkbox" :checked="isTagSelected(tag.id)" />
                  {{ tag.title }}
                </div>
              </div>
            </div>
            <div class="selected-items">
              <span 
                v-for="tagId in formData.tagIds" 
                :key="tagId"
                class="tag"
              >
                {{ getTagTitle(tagId) }}
                <i class="fa-solid fa-times" @click="removeTag(tagId)"></i>
              </span>
            </div>
          </div>
        </div>

        <h4>系列資訊（可選）</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>系列</label>
            <select v-model="formData.seriesId">
              <option :value="null">無系列（單行本）</option>
              <option v-for="series in seriesList" :key="series.id" :value="series.id">
                {{ series.title }}
              </option>
            </select>
          </div>
          <div class="form-group" v-if="formData.seriesId">
            <label>是否為代表作</label>
            <input type="checkbox" v-model="formData.representative" />
          </div>
        </div>
      </div>

      <!-- 步驟 2: 書籍副本 -->
      <div v-if="currentStep === 2" class="form-section">
        <div class="section-header">
          <h4>書籍副本管理</h4>
          <button class="btn btn-sm btn-primary" @click="addCopy">
            <i class="fa-solid fa-plus"></i>
            新增副本
          </button>
        </div>

        <table class="copies-table" v-if="formData.copies.length > 0">
          <thead>
            <tr>
              <th>書籍碼</th>
              <th>進貨日期</th>
              <th>狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(copy, index) in formData.copies" :key="index">
              <td>
                <input v-model="copy.uniqueCode" placeholder="自動生成或手動輸入" />
              </td>
              <td>
                <input v-model="copy.stockedDate" type="date" />
              </td>
              <td>
                <select v-model="copy.status">
                  <option value="A">在館</option>
                  <option value="U">已下架</option>
                </select>
              </td>
              <td>
                <button class="btn-icon text-danger" @click="removeCopy(index)">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-state">
          <p>尚無副本，請點擊「新增副本」按鈕</p>
        </div>
      </div>

      <!-- 步驟 3: 預覽 -->
      <div v-if="currentStep === 3" class="form-section preview-section">
        <h4>書籍資料預覽</h4>
        <div class="preview-grid">
          <div class="preview-item">
            <span class="label">書名：</span>
            <span class="value">{{ formData.title }}</span>
          </div>
          <div class="preview-item">
            <span class="label">ISBN：</span>
            <span class="value">{{ formData.isbn || '-' }}</span>
          </div>
          <div class="preview-item">
            <span class="label">出版年份：</span>
            <span class="value">{{ formData.publishYear || '-' }}</span>
          </div>
          <div class="preview-item">
            <span class="label">主分類：</span>
            <span class="value">{{ getMainCategoryName() }}</span>
          </div>
          <div class="preview-item">
            <span class="label">次分類：</span>
            <span class="value">{{ getSubCategoryName() }}</span>
          </div>
          <div class="preview-item">
            <span class="label">出版商：</span>
            <span class="value">{{ getPublisherName() }}</span>
          </div>
          <div class="preview-item">
            <span class="label">作者：</span>
            <span class="value">{{ getAuthorsText() }}</span>
          </div>
          <div class="preview-item">
            <span class="label">標籤：</span>
            <span class="value">{{ getTagsText() }}</span>
          </div>
          <div class="preview-item" v-if="formData.seriesId">
            <span class="label">系列：</span>
            <span class="value">{{ getSeriesName() }} {{ formData.representative ? '（代表作）' : '' }}</span>
          </div>
        </div>

        <h4>副本清單（共 {{ formData.copies.length }} 本）</h4>
        <table class="preview-table" v-if="formData.copies.length > 0">
          <thead>
            <tr>
              <th>書籍碼</th>
              <th>進貨日期</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(copy, index) in formData.copies" :key="index">
              <td>{{ copy.uniqueCode || '（自動生成）' }}</td>
              <td>{{ copy.stockedDate }}</td>
              <td>{{ copy.status === 'A' ? '在館' : '已下架' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 底部按鈕區 -->
    <div class="form-footer">
      <button class="btn btn-secondary" @click="handleClose">取消</button>
      <button 
        v-if="currentStep > 1" 
        class="btn btn-secondary" 
        @click="prevStep"
      >
        上一步
      </button>
      <button 
        v-if="currentStep < 3" 
        class="btn btn-primary" 
        @click="nextStep"
        :disabled="!canProceed"
      >
        下一步
      </button>
      <button 
        v-if="currentStep === 3" 
        class="btn btn-success" 
        @click="handleSubmit"
        :disabled="submitting"
      >
        {{ submitting ? '處理中...' : '確認送出' }}
      </button>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import BaseModal from '../common/BaseModal.vue'
import { categoriesAPI } from '../../api/categories'
import { authorsAPI, publishersAPI, tagsAPI, seriesAPI } from '../../api/admin/entities'
import adminBooksAPI from '../../api/admin/books'

const props = defineProps({
  isVisible: Boolean,
  bookData: Object, // 編輯模式時傳入
  mode: {
    type: String,
    default: 'create' // 'create' or 'edit'
  }
})

const emit = defineEmits(['close', 'success'])

const title = computed(() => props.mode === 'create' ? '新增書籍' : '編輯書籍')

const currentStep = ref(1)
const submitting = ref(false)

// 表單資料
const formData = ref({
  title: '',
  isbn: '',
  publishYear: null,
  imageUrl: '',
  mainCategoryId: null,
  categorySubId: null,
  publisherId: null,
  authorIds: [],
  tagIds: [],
  seriesId: null,
  representative: false,
  copies: []
})

// 下拉選項資料
const mainCategories = ref([])
const publishers = ref([])
const authors = ref([])
const tags = ref([])
const seriesList = ref([])

// 搜尋與下拉
const authorSearch = ref('')
const tagSearch = ref('')
const showAuthorDropdown = ref(false)
const showTagDropdown = ref(false)

const currentSubCategories = computed(() => {
  if (!formData.value.mainCategoryId) return []
  const mainCat = mainCategories.value.find(c => c.id === formData.value.mainCategoryId)
  return mainCat ? mainCat.categorySubs || [] : []
})

const filteredAuthors = computed(() => {
  if (!authorSearch.value) return authors.value
  return authors.value.filter(a => 
    a.name.toLowerCase().includes(authorSearch.value.toLowerCase())
  )
})

const filteredTags = computed(() => {
  if (!tagSearch.value) return tags.value
  return tags.value.filter(t => 
    t.title.toLowerCase().includes(tagSearch.value.toLowerCase())
  )
})

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return formData.value.title && 
           formData.value.categorySubId && 
           formData.value.publisherId &&
           formData.value.authorIds && 
           formData.value.authorIds.length > 0
  }
  return true
})

// 載入所有選項資料
const loadOptions = async () => {
  try {
    const [cats, pubs, auths, tgs, series] = await Promise.all([
      categoriesAPI.getAll(),
      publishersAPI.getAll(),
      authorsAPI.getAll(),
      tagsAPI.getAll(),
      seriesAPI.getAll()
    ])
    mainCategories.value = cats
    publishers.value = pubs
    authors.value = auths
    tags.value = tgs
    seriesList.value = series
  } catch (error) {
    console.error('載入選項失敗:', error)
  }
}

// 主分類改變
const onMainCategoryChange = () => {
  formData.value.categorySubId = null
}

// 作者操作
const isAuthorSelected = (id) => formData.value.authorIds && formData.value.authorIds.includes(id)
const toggleAuthor = (author) => {
  if (!formData.value.authorIds) {
    formData.value.authorIds = []
  }
  const index = formData.value.authorIds.indexOf(author.id)
  if (index > -1) {
    formData.value.authorIds.splice(index, 1)
  } else {
    formData.value.authorIds.push(author.id)
  }
}
const removeAuthor = (id) => {
  const index = formData.value.authorIds.indexOf(id)
  if (index > -1) formData.value.authorIds.splice(index, 1)
}
const getAuthorName = (id) => {
  const author = authors.value.find(a => a.id === id)
  return author ? author.name : ''
}

// 標籤操作
const isTagSelected = (id) => formData.value.tagIds && formData.value.tagIds.includes(id)
const toggleTag = (tag) => {
  if (!formData.value.tagIds) {
    formData.value.tagIds = []
  }
  const index = formData.value.tagIds.indexOf(tag.id)
  if (index > -1) {
    formData.value.tagIds.splice(index, 1)
  } else {
    formData.value.tagIds.push(tag.id)
  }
}
const removeTag = (id) => {
  const index = formData.value.tagIds.indexOf(id)
  if (index > -1) formData.value.tagIds.splice(index, 1)
}
const getTagTitle = (id) => {
  const tag = tags.value.find(t => t.id === id)
  return tag ? tag.title : ''
}

// 副本操作
const addCopy = () => {
  formData.value.copies.push({
    uniqueCode: '',
    stockedDate: new Date().toISOString().split('T')[0],
    status: 'A'
  })
}
const removeCopy = (index) => {
  formData.value.copies.splice(index, 1)
}

// 步驟導航
const nextStep = () => {
  if (canProceed.value && currentStep.value < 3) {
    currentStep.value++
  }
}
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// 預覽輔助函數
const getMainCategoryName = () => {
  const cat = mainCategories.value.find(c => c.id === formData.value.mainCategoryId)
  return cat ? cat.categoryTitle : '-'
}
const getSubCategoryName = () => {
  const sub = currentSubCategories.value.find(s => s.id === formData.value.categorySubId)
  return sub ? sub.categorySubTitle : '-'
}
const getPublisherName = () => {
  const pub = publishers.value.find(p => p.id === formData.value.publisherId)
  return pub ? pub.pubName : '-'
}
const getAuthorsText = () => {
  return formData.value.authorIds.map(id => getAuthorName(id)).join('、') || '-'
}
const getTagsText = () => {
  return formData.value.tagIds.map(id => getTagTitle(id)).join('、') || '-'
}
const getSeriesName = () => {
  const series = seriesList.value.find(s => s.id === formData.value.seriesId)
  return series ? series.title : '-'
}

// 送出
const handleSubmit = async () => {
  try {
    submitting.value = true
    
    // 轉換作者和標籤格式為後端期望的格式
    const authorsDTO = {
      existingIds: formData.value.authorIds,
      newNames: []
    }
    
    const tagsDTO = {
      existingIds: formData.value.tagIds,
      newNames: []
    }
    
    const payload = {
      title: formData.value.title,
      isbn: formData.value.isbn,
      publishYear: formData.value.publishYear,
      imageUrl: formData.value.imageUrl,
      categorySubId: formData.value.categorySubId,
      publisherId: formData.value.publisherId,
      authors: authorsDTO,
      tags: tagsDTO,
      seriesId: formData.value.seriesId,
      representative: formData.value.representative
    }

    if (props.mode === 'create') {
      // 創建書籍
      const createdBook = await adminBooksAPI.create(payload)
      
      // 如果有副本，逐一創建副本
      if (formData.value.copies.length > 0) {
        for (const copy of formData.value.copies) {
          try {
            await adminBooksAPI.createCopy(createdBook.id, {
              uniqueCode: copy.uniqueCode,
              stockedDate: copy.stockedDate,
              status: copy.status
            })
          } catch (err) {
            console.error('創建副本失敗:', err)
          }
        }
      }
      
      alert('新增成功！')
    } else {
      // 更新書籍
      await adminBooksAPI.update(props.bookData.id, payload)
      
      // TODO: 處理副本的更新（可能需要比對新舊副本）
      alert('更新成功！')
    }
    
    emit('success')
    handleClose()
  } catch (error) {
    alert('操作失敗：' + error)
  } finally {
    submitting.value = false
  }
}

const handleClose = () => {
  emit('close')
  // 重置表單
  currentStep.value = 1
  authorSearch.value = ''
  tagSearch.value = ''
  formData.value = {
    title: '',
    isbn: '',
    publishYear: null,
    imageUrl: '',
    mainCategoryId: null,
    categorySubId: null,
    publisherId: null,
    authorIds: [],
    tagIds: [],
    seriesId: null,
    representative: false,
    copies: []
  }
}

// 監聽編輯模式資料
// 監聽 props 變化，初始化表單資料
watch(() => props.isVisible, async (newVal) => {
  if (newVal) {
    await loadOptions()
    
    if (props.mode === 'edit' && props.bookData) {
      // 編輯模式：從後端資料轉換為表單格式
      await initEditForm()
    } else {
      // 新增模式：重置表單
      resetForm()
    }
  }
}, { immediate: true })

// 初始化編輯表單
const initEditForm = async () => {
  const data = props.bookData
  
  // 基本資料
  formData.value.title = data.title || ''
  formData.value.isbn = data.isbn || ''
  formData.value.publishYear = data.publishYear || null
  formData.value.imageUrl = data.imageUrl || ''
  formData.value.representative = data.representative || false
  
  // 根據名稱查找對應的 ID
  
  // 1. 出版商
  const publisher = publishers.value.find(p => p.pubName === data.publisher)
  formData.value.publisherId = publisher ? publisher.id : null
  
  // 2. 主分類和子分類
  const mainCat = mainCategories.value.find(cat => 
    cat.categorySubs?.some(sub => sub.categorySubTitle === data.subCategoryTitle)
  )
  if (mainCat) {
    formData.value.mainCategoryId = mainCat.id
    const subCat = mainCat.categorySubs.find(sub => sub.categorySubTitle === data.subCategoryTitle)
    formData.value.categorySubId = subCat ? subCat.id : null
  }
  
  // 3. 作者（從名稱轉換為 ID）
  if (data.authors && Array.isArray(data.authors)) {
    formData.value.authorIds = authors.value
      .filter(a => data.authors.includes(a.name))
      .map(a => a.id)
  } else if (data.authors && typeof data.authors === 'object') {
    // 如果是 Set，轉為陣列
    const authorNames = Array.from(data.authors)
    formData.value.authorIds = authors.value
      .filter(a => authorNames.includes(a.name))
      .map(a => a.id)
  } else {
    formData.value.authorIds = []
  }
  
  // 4. 標籤（從名稱轉換為 ID）
  if (data.tags && Array.isArray(data.tags)) {
    formData.value.tagIds = tags.value
      .filter(t => data.tags.includes(t.title))
      .map(t => t.id)
  } else if (data.tags && typeof data.tags === 'object') {
    // 如果是 Set，轉為陣列
    const tagTitles = Array.from(data.tags)
    formData.value.tagIds = tags.value
      .filter(t => tagTitles.includes(t.title))
      .map(t => t.id)
  } else {
    formData.value.tagIds = []
  }
  
  // 5. 系列和代表作
  if (data.seriesTitle && data.seriesId) {
    // 優先使用 seriesId（如果後端有提供）
    formData.value.seriesId = data.seriesId
    formData.value.representative = data.representative === true
  } else if (data.seriesTitle) {
    // 回退：透過名稱查找
    const series = seriesList.value.find(s => s.title === data.seriesTitle)
    formData.value.seriesId = series ? series.id : null
    formData.value.representative = data.representative === true
  } else {
    formData.value.seriesId = null
    formData.value.representative = false
  }
  
  // 6. 副本
  formData.value.copies = data.bookCopies ? 
    Array.from(data.bookCopies).map(copy => ({
      uniqueCode: copy.uniqueCode || copy['書籍碼'] || '',
      stockedDate: copy.stockedDate || new Date().toISOString().split('T')[0],
      status: copy.status || 'A'
    })) : []
}

// 點擊外部關閉下拉
const handleClickOutside = (e) => {
  if (!e.target.closest('.multi-select')) {
    showAuthorDropdown.value = false
    showTagDropdown.value = false
  }
}

onMounted(() => {
  loadOptions()
  document.addEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.book-form {
  max-height: 70vh;
  overflow-y: auto;
  padding: 20px;
}

.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  position: relative;
}

.steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: #e5e7eb;
  z-index: 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s;
}

.step.active .step-number {
  background: var(--primary);
  color: white;
}

.step-label {
  font-size: 14px;
  color: #6b7280;
}

.step.active .step-label {
  color: var(--primary);
  font-weight: 500;
}

.form-section {
  margin-top: 20px;
}

.form-section h4 {
  margin: 20px 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:disabled,
.form-group select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.multi-select {
  position: relative;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin-top: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.selected-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background-color: var(--primary);
  color: white;
  border-radius: 4px;
  font-size: 13px;
}

.tag i {
  cursor: pointer;
  opacity: 0.8;
}

.tag i:hover {
  opacity: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.copies-table,
.preview-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

.copies-table th,
.preview-table th {
  background-color: #f9fafb;
  padding: 10px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.copies-table td,
.preview-table td {
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.copies-table input,
.copies-table select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.preview-section {
  background-color: #f9fafb;
  padding: 20px;
  border-radius: 8px;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.preview-item {
  display: flex;
  gap: 8px;
}

.preview-item .label {
  font-weight: 500;
  color: #6b7280;
  min-width: 80px;
}

.preview-item .value {
  color: #111827;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.form-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 20px 0 0 0;
  border-top: 2px solid #e5e7eb;
  margin-top: 20px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  color: #6b7280;
}

.btn-icon.text-danger {
  color: #ef4444;
}
</style>

