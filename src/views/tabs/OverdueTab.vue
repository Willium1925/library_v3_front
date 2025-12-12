<template>
  <div class="overdue-tab">
    <h2 class="panel-header overdue-header">逾期未還</h2>
    
    <div v-if="!loading && overdueLoans.length > 0" class="overdue-list">
      <BookListCard
        v-for="loan in overdueLoans"
        :key="loan.id"
        :book="loan"
        :is-overdue="true"
      >
        <template #meta>
          <div class="card-meta">借閱日期：{{ formatDate(loan.loanDate) }}</div>
          <div class="card-meta">到期日期：{{ formatDate(loan.dueDate) }}</div>
        </template>
        <template #status>
          <div class="overdue-text">
            <i class="fa-solid fa-triangle-exclamation"></i> 已逾期 {{ calculateOverdueDays(loan.dueDate) }} 天
          </div>
        </template>
      </BookListCard>
    </div>
    
    <div v-else-if="loading" class="loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>載入中...</p>
    </div>
    
    <div v-else class="no-data">
      <i class="fa-regular fa-circle-check"></i>
      <p>目前無逾期書籍</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import BookListCard from '../../components/user/BookListCard.vue'

const userStore = useUserStore()

const loading = ref(false)
const overdueLoans = ref([])

const fetchOverdueLoans = async () => {
  try {
    loading.value = true
    await userStore.fetchOverdueLoans()
    overdueLoans.value = userStore.overdueLoans
  } catch (error) {
    console.error('獲取逾期記錄失敗:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW')
}

const calculateOverdueDays = (dueDateString) => {
  const dueDate = new Date(dueDateString)
  const now = new Date()
  const diffTime = now - dueDate
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

onMounted(() => {
  fetchOverdueLoans()
})
</script>

<style scoped>
.overdue-tab {
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

.overdue-header {
  color: var(--accent);
  border-color: var(--accent);
}

.overdue-list {
  display: flex;
  flex-direction: column;
}

.overdue-text {
  color: var(--accent);
  font-weight: 700;
  font-size: 14px;
  margin-top: 10px;
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

