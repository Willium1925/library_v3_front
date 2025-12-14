<template>
  <div class="reservations-tab">
    <h2 class="panel-header">我的預約</h2>
    
    <div v-if="!loading && reservations.length > 0" class="reservations-list">
      <BookListCard
        v-for="reservation in reservations"
        :key="reservation.bookId"
        :book="reservation"
      >
        <template #meta>
          <div class="card-meta">預約日期：{{ formatDate(reservation.reserveDate) }}</div>
          <div class="card-meta" style="color:var(--primary); font-weight:700;">通知日期：{{ formatDate(reservation.notifyDate) }}</div>
        </template>
        <template #status>
          <span v-if="reservation.status === 'AVAILABLE'" class="status-pill ready">可取書</span>
          <span v-else class="status-pill waiting">等候到館</span>
          <div v-if="reservation.status === 'AVAILABLE'" style="font-size:13px;">
            預計保留至<br>{{ formatDate(reservation.expirationDate) }}
          </div>
          <div v-else style="font-size:13px;">順位：{{ reservation.queuePosition }}</div>
        </template>
      </BookListCard>
    </div>
    
    <div v-else-if="loading" class="loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>載入中...</p>
    </div>
    
    <div v-else class="no-data">
      <i class="fa-regular fa-bookmark"></i>
      <p>目前無預約記錄</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import BookListCard from '../../components/user/BookListCard.vue'

const userStore = useUserStore()

const loading = ref(false)
const reservations = ref([])

const fetchReservations = async () => {
  try {
    loading.value = true
    await userStore.fetchReservations()
    reservations.value = userStore.reservations
  } catch (error) {
    console.error('獲取預約記錄失敗:', error)
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
  fetchReservations()
})
</script>

<style scoped>
.reservations-tab {
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

.reservations-list {
  display: flex;
  flex-direction: column;
}

.status-pill {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 10px;
  display: inline-block;
}

.status-pill.ready {
  background: #e8f5e9;
  color: var(--success);
  border: 1px solid var(--success);
}

.status-pill.waiting {
  background: #eee;
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

