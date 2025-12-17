<template>
  <div class="entity-management">
    <div class="page-header">
      <h2 class="page-title">{{ title }}</h2>
      <div class="header-actions">
        <input v-model="keyword" placeholder="關鍵字搜尋" @keyup.enter="search" />
        <button class="btn btn-secondary" @click="loadAll">列出所有</button>
        <button class="btn btn-primary" @click="create">
          <i class="fa-solid fa-plus"></i>
          新增
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">載入中...</div>
    <div v-else-if="items.length === 0" class="no-data">尚無資料</div>
    <div v-else class="entity-table">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>名稱</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>
              <input 
                v-if="editing === item.id" 
                v-model="item[nameField]"
                @keydown.enter.prevent="save(item, $event)"
              />
              <span v-else>{{ item[nameField] }}</span>
            </td>
            <td>
              <button 
                v-if="editing === item.id" 
                class="btn-icon text-success"
                @click="save(item)"
              >
                <i class="fa-solid fa-check"></i>
              </button>
              <button 
                v-if="editing === item.id" 
                class="btn-icon"
                @click="cancelEdit"
              >
                <i class="fa-solid fa-times"></i>
              </button>
              <button 
                v-if="editing !== item.id" 
                class="btn-icon"
                @click="edit(item)"
              >
                <i class="fa-solid fa-edit"></i>
              </button>
              <button 
                class="btn-icon text-danger"
                @click="deleteItem(item.id)"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  title: String,
  api: Object,
  nameField: {
    type: String,
    default: 'name'
  }
})

const loading = ref(false)
const items = ref([])
const keyword = ref('')
const editing = ref(null)

const loadAll = async () => {
  try {
    loading.value = true
    items.value = await props.api.getAll()
  } catch (error) {
    alert('載入失敗：' + error)
  } finally {
    loading.value = false
  }
}

const search = async () => {
  if (!keyword.value.trim()) {
    loadAll()
    return
  }
  
  try {
    loading.value = true
    items.value = await props.api.search(keyword.value)
  } catch (error) {
    alert('搜尋失敗：' + error)
  } finally {
    loading.value = false
  }
}

const create = () => {
  const name = prompt(`請輸入${props.title}名稱：`)
  if (!name) return
  
  const data = { [props.nameField]: name }
  props.api.create(data)
    .then(() => {
      alert('新增成功')
      loadAll()
    })
    .catch(err => alert('新增失敗：' + err))
}

const edit = (item) => {
  editing.value = item.id
}

const save = async (item, event) => {
  if (event && event.isComposing) {
    return;
  }
  try {
    const data = { [props.nameField]: item[props.nameField] }
    await props.api.update(item.id, data)
    alert('更新成功')
    editing.value = null
    loadAll()
  } catch (error) {
    alert('更新失敗：' + error)
  }
}

const deleteItem = async (id) => {
  if (!confirm('確定要刪除嗎？')) return
  try {
    await props.api.delete(id)
    alert('刪除成功')
    loadAll()
  } catch (error) {
    alert('刪除失敗：' + error)
  }
}

const cancelEdit = () => {
  editing.value = null
  loadAll()
}

onMounted(() => {
  loadAll()
})
</script>

<style scoped>
.entity-management {
  max-width: 900px;
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

.header-actions {
  display: flex;
  gap: 8px;
}

.header-actions input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  width: 200px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
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

.btn-icon.text-success {
  color: #10b981;
}

.btn-icon.text-danger:hover {
  color: #ef4444;
}

.entity-table {
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background-color: #f9fafb;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
}

.data-table input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.loading, .no-data {
  background: white;
  padding: 40px;
  text-align: center;
  border-radius: 8px;
  color: #6b7280;
}
</style>
