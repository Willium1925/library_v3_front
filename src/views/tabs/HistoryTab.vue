<template>
  <div class="history-tab">
    <h2 class="panel-header">借閱歷史</h2>
    
    <div v-if="!loading && history.length > 0" class="history-list">
      <BookListCard
        v-for="record in history"
        :key="record.id"
        :book="record"
        class="history-card"
      >
        <template #meta>
          <div class="card-meta">書籍碼：{{ record.copyUniqueCode }}</div>
          <div class="card-meta">借閱：{{ formatDate(record.loanDate) }}｜到期：{{ formatDate(record.dueDate) }}</div>
          <div class="card-meta">歸還：{{ formatDate(record.returnDate) }}</div>
        </template>
        <template #status>
          <span style="color:var(--gray); font-size:14px;">已歸還</span>
        </template>
      </BookListCard>
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
import BookListCard from '../../components/user/BookListCard.vue'

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
}

.history-card {
  opacity: 0.8;
  background: #fdfdfd;
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

