<template>
  <div class="holdings-section">
    <h3 class="section-head">館藏資訊</h3>
    
    <table class="holdings-table">
      <thead>
        <tr>
          <th>館藏編號</th>
          <th>狀態</th>
          <th>到期日</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="copy in copies" :key="copy.id">
          <td class="copy-code">{{ copy.uniqueCode }}</td>
          <td>
            <span
              class="status"
              :class="{
                available: copy.status === 'A',
                loaned: copy.status === 'L',
                reserved: copy.status === 'R'
              }"
            >
              <i class="fa-solid fa-circle"></i>
              {{ getStatusText(copy.status) }}
            </span>
          </td>
          <td>
            <span v-if="copy.dueDate" class="due-date">
              {{ formatDate(copy.dueDate) }}
            </span>
            <span v-else class="no-date">—</span>
          </td>
          <td>
            <button
              v-if="copy.status === 'L'"
              class="action-btn btn-reserve"
              @click="handleReserve(copy.id)"
              :disabled="!isAuthenticated"
            >
              <i class="fa-solid fa-bookmark"></i>
              預約 {{ copy.queueCount > 0 ? `(排隊 ${copy.queueCount})` : '' }}
            </button>
            <button
              v-else-if="copy.status === 'A'"
              class="action-btn btn-available"
              disabled
            >
              <i class="fa-solid fa-check"></i>
              可館內借閱
            </button>
            <span v-else class="reserved-info">
              已有 {{ copy.queueCount }} 人預約
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="copies.length === 0" class="no-copies">
      <p>目前無館藏資訊</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { reservationsAPI } from '../../api/reservations'

const props = defineProps({
  copies: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['reserve-success'])

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const getStatusText = (status) => {
  const statusMap = {
    'A': '可借閱',
    'L': '已借出',
    'R': '預約中',
    'M': '維修中'
  }
  return statusMap[status] || '未知'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const handleReserve = async (copyId) => {
  if (!isAuthenticated.value) {
    alert('請先登入')
    return
  }
  
  try {
    const confirmed = confirm('確定要預約這本書嗎？')
    if (!confirmed) return
    
    await reservationsAPI.reserve(copyId)
    alert('預約成功！')
    emit('reserve-success')
  } catch (error) {
    alert('預約失敗：' + error)
  }
}
</script>

<style scoped>
.holdings-section {
  margin-bottom: 60px;
}

.section-head {
  font-size: 24px;
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.section-head::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 24px;
  background: var(--accent);
  margin-right: 15px;
}

.holdings-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid var(--primary);
}

.holdings-table th {
  background: var(--primary);
  color: #fff;
  padding: 15px;
  text-align: left;
  font-weight: 500;
  letter-spacing: 1px;
}

.holdings-table td {
  padding: 20px 15px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
}

.holdings-table tr:last-child td {
  border-bottom: none;
}

.copy-code {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: var(--gray);
}

.status {
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status.available {
  color: var(--success);
}

.status.loaned {
  color: var(--accent);
}

.status.reserved {
  color: #ff9800;
}

.status i {
  font-size: 10px;
}

.due-date {
  font-weight: 400;
  font-size: 13px;
  color: var(--gray);
}

.no-date {
  color: var(--gray);
  opacity: 0.5;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-reserve {
  background: var(--accent);
  color: #fff;
}

.btn-reserve:hover:not(:disabled) {
  background: #b71c1c;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-reserve:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-available {
  background: var(--success);
  color: #fff;
  cursor: default;
  opacity: 0.7;
}

.reserved-info {
  font-size: 13px;
  color: var(--gray);
}

.no-copies {
  text-align: center;
  padding: 40px;
  color: var(--gray);
  background: #f9f9f9;
  border: 1px dashed var(--light-border);
}
</style>

