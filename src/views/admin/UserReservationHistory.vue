<template>
  <div class="history-page">
    <div class="page-header">
      <h2 class="page-title">會員預約記錄</h2>
    </div>

    <div v-if="loading" class="loading">載入中...</div>
    <div v-else-if="reservations.length === 0" class="no-data">尚無記錄</div>
    <div v-else class="history-table">
      <table class="data-table">
        <thead>
          <tr>
            <th>書名</th>
            <th>書籍碼</th>
            <th>預約日期</th>
            <th>通知日期</th>
            <th>過期日期</th>
            <th>取書日期</th>
            <th>排隊位置</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="res in reservations" :key="res.id">
            <td>{{ res.title }}</td>
            <td>{{ res.uniqueCode }}</td>
            <td>{{ formatDate(res.reserveDate) }}</td>
            <td>{{ formatDate(res.notifyDate) }}</td>
            <td>{{ formatDate(res.expirationDate) }}</td>
            <td>{{ res.pickupDate ? formatDate(res.pickupDate) : '-' }}</td>
            <td>{{ res.queuePosition }}</td>
            <td>{{ res.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import adminUsersAPI from '../../api/admin/users'

const props = defineProps({
  userId: { type: [String, Number], default: null }
})

const route = useRoute()

const resolvedUserId = props.userId ?? route.params.userId

const loading = ref(false)
const reservations = ref([])

const loadReservations = async () => {
  if (!resolvedUserId) {
    reservations.value = []
    return
  }

  try {
    loading.value = true
    reservations.value = await adminUsersAPI.getReservations(resolvedUserId)
  } catch (error) {
    alert('查詢失敗：' + error)
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-TW')
}

onMounted(() => {
  loadReservations()
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
