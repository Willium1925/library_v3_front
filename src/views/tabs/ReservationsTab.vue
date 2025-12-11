<template>
  <div class="reservations-tab">
    <h2 class="panel-header">我的預約</h2>
    
    <div v-if="!loading && reservations.length > 0" class="reservations-list">
      <ReservationCard
        v-for="reservation in reservations"
        :key="reservation.id"
        :reservation="reservation"
        @cancel="handleCancel"
      />
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
import ReservationCard from '../../components/user/ReservationCard.vue'

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

const handleCancel = async (reservationId) => {
  try {
    await userStore.cancelReservation(reservationId)
    alert('取消預約成功！')
    await fetchReservations()
  } catch (error) {
    alert('取消預約失敗：' + error)
  }
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

