<template>
  <div class="loans-tab">
    <h2 class="panel-header">目前借閱</h2>
    
    <div v-if="!loading && loans.length > 0" class="loans-list">
      <LoanCard
        v-for="loan in loans"
        :key="loan.id"
        :loan="loan"
        @renew="handleRenew"
      />
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
import LoanCard from '../../components/user/LoanCard.vue'

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

const handleRenew = async (loanId) => {
  try {
    await userStore.renewLoan(loanId)
    alert('續借成功！')
    await fetchLoans()
  } catch (error) {
    alert('續借失敗：' + error)
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
  gap: 15px;
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

