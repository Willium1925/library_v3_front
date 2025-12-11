<template>
  <div class="history-tab">
    <h2 class="panel-header">借閱歷史</h2>
    
    <div v-if="!loading && history.length > 0" class="history-list">
      <div v-for="record in history" :key="record.id" class="history-item">
        <div class="book-info">
          <h4 class="book-title">{{ record.bookTitle }}</h4>
          <p class="book-meta">作者：{{ record.author }}</p>
          <p class="book-meta">館藏編號：{{ record.copyUniqueCode }}</p>
        </div>
        <div class="date-info">
          <div class="date-row">
            <span class="date-label">借閱日：</span>
            <span>{{ formatDate(record.loanDate) }}</span>
          </div>
          <div class="date-row">
            <span class="date-label">歸還日：</span>
            <span>{{ formatDate(record.returnDate) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="loading" class="loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>載入中...</p>
    </div>
    
    <div v-else class="no-data">
      <i class="fa-regular fa-clock"></i>
      <p>暫無借閱歷史</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()

const loading = ref(false)
const history = ref([])

const fetchHistory = async () => {
  try {
    loading.value = true
    await userStore.fetchLoanHistory()
    history.value = userStore.loanHistory
  } catch (error) {
    console.error('獲取借閱歷史失敗:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW')
}

onMounted(() => {
  fetchHistory()
})
</script>

<style scoped>
.history-tab {
  animation: fadeIn 0.3s;
}

.panel-header {
  font-family: 'Noto Serif TC', serif;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--primary);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  background: #fff;
  border: 1px solid var(--light-border);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-info {
  flex: 1;
}

.book-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
}

.book-meta {
  font-size: 13px;
  color: var(--gray);
  margin-bottom: 4px;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
}

.date-row {
  display: flex;
  gap: 10px;
}

.date-label {
  font-weight: 500;
  color: var(--gray);
}

.loading,
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--gray);
}

.loading i,
.no-data i {
  font-size: 50px;
  margin-bottom: 15px;
  opacity: 0.5;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

