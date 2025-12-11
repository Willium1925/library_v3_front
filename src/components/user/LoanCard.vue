<template>
  <div class="loan-card">
    <div class="book-thumb">
      <img
        :src="loan.imageUrl || 'https://placehold.co/100x150/eee/333?text=Book'"
        :alt="loan.title"
      />
    </div>
    <div class="loan-info">
      <h4 class="book-title">{{ loan.title }}</h4>
      <p class="book-meta">作者：{{ loan.author }}</p>
      <p class="book-meta">書籍碼：{{ loan.uniqueCode }}</p>
      <div class="date-info">
        <span class="date-label">借閱日：{{ formatDate(loan.loanDate) }}</span>
        <span class="date-label">到期日：{{ formatDate(loan.dueDate) }}</span>
      </div>
      <div class="date-info">
        <div class="date-label">借閱日期：2025-12-01</div>
        <div class="card-meta" style="color:var(--primary); font-weight:700;">到期日期：2025-12-31</div>
      </div>
      <div v-if="loan.renewalCount !== undefined" class="renewal-info">
        <span>已續借：{{ loan.renewalCount }} / 2 次</span>
      </div>
    </div>
    <div class="loan-actions">
      <button
        v-if="canRenew(loan)"
        @click="handleRenew"
        class="btn btn-renew"
      >
        <i class="fa-solid fa-rotate"></i>
        續借
      </button>
      <span v-else-if="isOverdue(loan.dueDate)" class="overdue-label">
        已逾期
      </span>
      <span v-else-if="loan.renewalCount >= 2" class="info-label">
        已達續借上限
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  loan: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['renew'])

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW')
}

const isOverdue = (dueDateString) => {
  if (!dueDateString) return false
  const dueDate = new Date(dueDateString)
  const now = new Date()
  return now > dueDate
}

const canRenew = (loan) => {
  if (loan.renewalCount >= 2) return false
  if (isOverdue(loan.dueDate)) return false
  
  // 只能在到期前3天續借
  const dueDate = new Date(loan.dueDate)
  const now = new Date()
  const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
  
  return diffDays <= 3 && diffDays >= 0
}

const handleRenew = () => {
  emit('renew', props.loan.id)
}
</script>

<style scoped>
.loan-card {
  background: #fff;
  border: 1px solid var(--light-border);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  gap: 20px;
  transition: box-shadow 0.3s;
}

.loan-card:hover {
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

.loan-info {
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

.date-info {
  font-size: 16px;
  flex: 1;
  display: flex;
  flex-direction:column;
  justify-content: center;
}

.date-label {
  font-weight: 500;
  color: var(--gray);
}

.date-value {
  font-weight: 700;
  margin-left: 5px;
}

.date-value.overdue {
  color: var(--accent);
}

.renewal-info {
  font-size: 12px;
  color: var(--gray);
  margin-top: 5px;
}

.loan-actions {
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

.btn-renew {
  background: var(--primary);
  color: #fff;
}

.btn-renew:hover {
  background: var(--gray);
}

.overdue-label {
  color: var(--accent);
  font-weight: 700;
  font-size: 13px;
}

.info-label {
  color: var(--gray);
  font-size: 12px;
}
</style>

