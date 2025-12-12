<template>
  <div class="loans-tab">
    <h2 class="panel-header">目前借閱</h2>
    
    <div v-if="!loading && loans.length > 0" class="loans-list">
      <BookListCard
        v-for="loan in loans"
        :key="loan.id"
        :book="loan"
      >
        <template #meta>
          <div class="card-meta">借閱日期：{{ formatDate(loan.loanDate) }}</div>
          <div class="card-meta" style="color:var(--primary); font-weight:700;">到期日期：{{ formatDate(loan.dueDate) }}</div>
        </template>
        <template #status>
          <button class="btn btn-sm" @click="handleRenew(loan.id)">續借</button>
        </template>
      </BookListCard>
    </div>
    
    <div v-else-if="loading" class="loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>載入中...</p>
    </div>
    
    <div v-else class="no-data">
      <i class="fa-regular fa-circle-xmark"></i>
      <p>目前無借閱記錄</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import BookListCard from '../../components/user/BookListCard.vue'

const userStore = useUserStore()

const loading = ref(false)
const loans = ref([])

const fetchLoans = async () => {
  try {
    loading.value = true
    await userStore.fetchCurrentLoans()
    loans.value = userStore.currentLoans
  } catch (error) {
    console.error('獲取借閱記錄失敗:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW')
}

const handleRenew = async (loanId) => {
  try {
    await userStore.renewLoan(loanId)
    alert('V續借成功！')
    await fetchLoans()
  } catch (error) {
    alert('V續借失敗：' + error)
  }
}

onMounted(() => {
  fetchLoans()
})
</script>

<style scoped>
.loans-tab {
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

.loans-list {
  display: flex;
  flex-direction: column;
}

.btn {
  padding: 10px 25px;
  border: 1px solid var(--primary);
  background: transparent;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  font-size: 14px;
}

.btn:hover {
  background: var(--primary);
  color: #fff;
}

.btn-sm {
  padding: 5px 15px;
  font-size: 13px;
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

.card-meta {
  font-size: 13px;
  color: #555;
  margin-bottom: 4px;
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

