<template>
  <div class="history-page">
    <div class="page-header">
      <button class="btn btn-secondary" @click="goBack">
        <i class="fa-solid fa-arrow-left"></i>
        返回
      </button>
      <h2 class="page-title">副本預約記錄</h2>
    </div>

    <div v-if="loading" class="loading">載入中...</div>
    <div v-else-if="history.length === 0" class="no-data">尚無記錄</div>
    <div v-else class="history-table">
      <table class="data-table">
        <thead>
          <tr>
            <th>記錄ID</th>
            <th>預約日期</th>
            <th>通知日期</th>
            <th>過期日期</th>
            <th>取書日期</th>
            <th>借書證號</th>
            <th>會員姓名</th>
            <th>排隊位置</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in history" :key="item[0]">
            <td>{{ item[0] }}</td>
            <td>{{ formatDate(item[1]) }}</td>
            <td>{{ formatDate(item[2]) }}</td>
            <td>{{ formatDate(item[3]) }}</td>
            <td>{{ item[4] ? formatDate(item[4]) : '-' }}</td>
            <td>{{ item[5] }}</td>
            <td>{{ item[6] }}</td>
            <td>{{ item[7] }}</td>
            <td>{{ item[8] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import adminBooksAPI from '../../api/admin/books'

const route = useRoute()
const router = useRouter()

const copyId = route.params.copyId
const loading = ref(false)
const history = ref([])

const loadHistory = async () => {
  try {
    loading.value = true
    history.value = await adminBooksAPI.getCopyReservationHistory(copyId)
  } catch (error) {
    alert('查詢失敗：' + error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-TW')
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.history-page {
  max-width: 1200px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--primary);
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

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.history-table {
  background: white;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
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

.loading, .no-data {
  background: white;
  padding: 40px;
  text-align: center;
  border-radius: 8px;
  color: #6b7280;
}
</style>

