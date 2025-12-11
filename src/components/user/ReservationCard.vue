<template>
  <div class="reservation-card">
    <div class="book-thumb">
      <img
        :src="reservation.coverImage || 'https://placehold.co/100x150/eee/333?text=Book'"
        :alt="reservation.bookTitle"
      />
    </div>
    <div class="reservation-info">
      <h4 class="book-title">{{ reservation.bookTitle }}</h4>
      <p class="book-meta">作者：{{ reservation.author }}</p>
      <p class="book-meta">館藏編號：{{ reservation.copyUniqueCode }}</p>
      <div class="reservation-status">
        <span class="status-label">狀態：</span>
        <span :class="getStatusClass(reservation.status)">
          {{ getStatusText(reservation.status) }}
        </span>
      </div>
      <div v-if="reservation.queuePosition" class="queue-info">
        <span>排隊順位：第 {{ reservation.queuePosition }} 位</span>
      </div>
      <div v-if="reservation.notificationDate" class="date-info">
        <span>通知日期：{{ formatDate(reservation.notificationDate) }}</span>
      </div>
      <div v-if="reservation.pickupDeadline" class="pickup-deadline">
        <span>取書期限：{{ formatDate(reservation.pickupDeadline) }}</span>
      </div>
    </div>
    <div class="reservation-actions">
      <button
        @click="handleCancel"
        class="btn btn-cancel"
      >
        <i class="fa-solid fa-times"></i>
        取消預約
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  reservation: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['cancel'])

const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '排隊中',
    'NOTIFIED': '可取書',
    'EXPIRED': '已逾期'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  return {
    'status-pending': status === 'PENDING',
    'status-ready': status === 'NOTIFIED',
    'status-expired': status === 'EXPIRED'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW')
}

const handleCancel = () => {
  if (confirm('確定要取消這個預約嗎？')) {
    emit('cancel', props.reservation.id)
  }
}
</script>

<style scoped>
.reservation-card {
  background: #fff;
  border: 1px solid var(--light-border);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  gap: 20px;
  transition: box-shadow 0.3s;
}

.reservation-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.book-thumb {
  width: 80px;
  height: 120px;
  flex-shrink: 0;
  background: #f0f0f0;
  border: 1px solid var(--light-border);
  overflow: hidden;
}

.book-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reservation-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.book-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 5px;
}

.book-meta {
  font-size: 13px;
  color: var(--gray);
}

.reservation-status {
  display: flex;
  align-items: center;
  font-size: 13px;
  margin-top: 10px;
}

.status-label {
  font-weight: 500;
  color: var(--gray);
  margin-right: 8px;
}

.status-pending {
  color: #ff9800;
  font-weight: 700;
}

.status-ready {
  color: var(--success);
  font-weight: 700;
}

.status-expired {
  color: var(--accent);
  font-weight: 700;
}

.queue-info,
.date-info,
.pickup-deadline {
  font-size: 12px;
  color: var(--gray);
}

.pickup-deadline {
  font-weight: 700;
  color: var(--accent);
}

.reservation-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-cancel {
  background: #f0f0f0;
  color: var(--accent);
  border: 1px solid var(--accent);
}

.btn-cancel:hover {
  background: var(--accent);
  color: #fff;
}
</style>

