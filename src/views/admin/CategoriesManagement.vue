<template>
  <div class="categories-management">
    <h2 class="page-title">分類管理</h2>

    <div class="management-container">
      <!-- 主分類區（左） -->
      <div class="category-section">
        <div class="section-header">
          <h3>主分類</h3>
          <button class="btn btn-primary btn-sm" @click="addMainCategory">
            <i class="fa-solid fa-plus"></i>
            新增
          </button>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名稱</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in mainCategories" :key="cat.id">
              <td>{{ cat.id }}</td>
              <td>
                <input 
                  v-if="editingMain === cat.id" 
                  v-model="cat.categoryTitle"
                  @keyup.enter="saveMainCategory(cat)"
                />
                <span v-else>{{ cat.categoryTitle }}</span>
              </td>
              <td>
                <button 
                  v-if="editingMain === cat.id" 
                  class="btn-icon text-success"
                  @click="saveMainCategory(cat)"
                >
                  <i class="fa-solid fa-check"></i>
                </button>
                <button 
                  v-if="editingMain === cat.id" 
                  class="btn-icon"
                  @click="cancelEdit"
                >
                  <i class="fa-solid fa-times"></i>
                </button>
                <button 
                  v-if="editingMain !== cat.id" 
                  class="btn-icon"
                  @click="editMainCategory(cat)"
                >
                  <i class="fa-solid fa-edit"></i>
                </button>
                <button 
                  class="btn-icon text-danger"
                  @click="deleteMainCategory(cat.id)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 子分類區（右） -->
      <div class="category-section">
        <div class="section-header">
          <h3>子分類</h3>
          <button class="btn btn-primary btn-sm" @click="addSubCategory">
            <i class="fa-solid fa-plus"></i>
            新增
          </button>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名稱</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sub in subCategories" :key="sub.id">
              <td>{{ sub.id }}</td>
              <td>
                <input 
                  v-if="editingSub === sub.id" 
                  v-model="sub.categorySubTitle"
                  @keyup.enter="saveSubCategory(sub)"
                />
                <span v-else>{{ sub.categorySubTitle }}</span>
              </td>
              <td>
                <button 
                  v-if="editingSub === sub.id" 
                  class="btn-icon text-success"
                  @click="saveSubCategory(sub)"
                >
                  <i class="fa-solid fa-check"></i>
                </button>
                <button 
                  v-if="editingSub === sub.id" 
                  class="btn-icon"
                  @click="cancelEdit"
                >
                  <i class="fa-solid fa-times"></i>
                </button>
                <button 
                  v-if="editingSub !== sub.id" 
                  class="btn-icon"
                  @click="editSubCategory(sub)"
                >
                  <i class="fa-solid fa-edit"></i>
                </button>
                <button 
                  class="btn-icon text-danger"
                  @click="deleteSubCategory(sub.id)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { categoriesAPI } from '../../api/categories'
import adminCategoriesAPI from '../../api/admin/categories'

const mainCategories = ref([])
const subCategories = ref([])
const editingMain = ref(null)
const editingSub = ref(null)

const loadData = async () => {
  try {
    const cats = await categoriesAPI.getAll()
    mainCategories.value = cats
    subCategories.value = cats.flatMap(c => c.categorySubs || [])
  } catch (error) {
    alert('載入失敗：' + error)
  }
}

const addMainCategory = () => {
  const title = prompt('請輸入主分類名稱：')
  if (!title) return
  
  adminCategoriesAPI.createMain({ categoryTitle: title })
    .then(() => {
      alert('新增成功')
      loadData()
    })
    .catch(err => alert('新增失敗：' + err))
}

const editMainCategory = (cat) => {
  editingMain.value = cat.id
}

const saveMainCategory = async (cat) => {
  try {
    await adminCategoriesAPI.updateMain(cat.id, { categoryTitle: cat.categoryTitle })
    alert('更新成功')
    editingMain.value = null
    loadData()
  } catch (error) {
    alert('更新失敗：' + error)
  }
}

const deleteMainCategory = async (id) => {
  if (!confirm('確定要刪除此主分類嗎？')) return
  try {
    await adminCategoriesAPI.deleteMain(id)
    alert('刪除成功')
    loadData()
  } catch (error) {
    alert('刪除失敗：' + error)
  }
}

const addSubCategory = () => {
  const title = prompt('請輸入子分類名稱：')
  if (!title) return
  
  const categoryId = prompt('請輸入所屬主分類ID：')
  if (!categoryId) return
  
  adminCategoriesAPI.createSub({ categorySubTitle: title, categoryId: parseInt(categoryId) })
    .then(() => {
      alert('新增成功')
      loadData()
    })
    .catch(err => alert('新增失敗：' + err))
}

const editSubCategory = (sub) => {
  editingSub.value = sub.id
}

const saveSubCategory = async (sub) => {
  try {
    await adminCategoriesAPI.updateSub(sub.id, { categorySubTitle: sub.categorySubTitle })
    alert('更新成功')
    editingSub.value = null
    loadData()
  } catch (error) {
    alert('更新失敗：' + error)
  }
}

const deleteSubCategory = async (id) => {
  if (!confirm('確定要刪除此子分類嗎？')) return
  try {
    await adminCategoriesAPI.deleteSub(id)
    alert('刪除成功')
    loadData()
  } catch (error) {
    alert('刪除失敗：' + error)
  }
}

const cancelEdit = () => {
  editingMain.value = null
  editingSub.value = null
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.categories-management {
  max-width: 1400px;
}

.page-title {
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--primary);
}

.management-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.category-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
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

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  color: #6b7280;
}

.btn-icon:hover {
  color: var(--primary);
}

.btn-icon.text-success {
  color: #10b981;
}

.btn-icon.text-danger:hover {
  color: #ef4444;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background-color: #f9fafb;
  padding: 10px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.data-table td {
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
}

.data-table input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}
</style>

