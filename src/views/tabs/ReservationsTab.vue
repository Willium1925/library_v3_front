<template>
  <div class="reservations-tab">
    <h2 class="panel-header">我的預約</h2>
    
    <div v-if="!userStore.loading && userStore.reservations.length > 0" class="reservations-list">
      <BookListCard
        v-for="reservation in userStore.reservations"
        :key="reservation.reservationId"
        :book="reservation"
      >
        <template #meta>
          <div class="card-meta">預約日期：{{ formatDate(reservation.reserveDate) }}</div>
          <div v-if="reservation.notifyDate" class="card-meta" style="color:var(--primary); font-weight:700;">通知取書：{{ formatDate(reservation.notifyDate) }}</div>
        </template>
        <template #status>
          <span v-if="reservation.status === 'AVAILABLE'" class="status-pill ready">可取書</span>
          <span v-else-if="reservation.status === 'PENDING'" class="status-pill waiting">排隊等候</span>

          <div v-if="reservation.status === 'AVAILABLE'" class="status-text">
            請於 {{ formatDate(reservation.expirationDate) }} 前<br>至櫃檯取書
          </div>
          <div v-else-if="reservation.status === 'PENDING'" class="status-text">目前順位：{{ reservation.queuePosition }}</div>
        </template>
        <template #actions>
          <button
            v-if="reservation.status === 'PENDING' || reservation.status === 'AVAILABLE'"
            class="btn-cancel"
            @click.stop="handleCancelReservation(reservation.reservationId)"
          >
            <i class="fa-regular fa-trash-can"></i> 取消預約
          </button>
        </template>
      </BookListCard>
    </div>
    
    <div v-else-if="userStore.loading" class="loading">
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
import { onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import { reservationsAPI } from '../../api/reservations'
import BookListCard from '../../components/user/BookListCard.vue'

const userStore = useUserStore()

const handleCancelReservation = async (reservationId) => {
  if (!confirm('確定要取消這筆預約嗎？')) {
    return
  }
  try {
    await reservationsAPI.cancel(reservationId)
    alert('預約已取消')
    // 重新獲取列表以更新畫面
    await userStore.fetchReservations()
  } catch (error) {
    console.error('取消預約失敗:', error)
    alert('取消預約失敗')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW')
}

onMounted(() => {
  userStore.fetchReservations()
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

.status-text {
  font-size: 13px;
  line-height: 1.4;
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

.btn-cancel {
  background: none;
  border: 1px solid var(--accent);
  color: var(--accent);
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: var(--accent);
  color: white;
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
