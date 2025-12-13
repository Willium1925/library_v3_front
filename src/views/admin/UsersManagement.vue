<template>
  <div class="users-management">
    <h2 class="page-title">會員管理</h2>

    <!-- 搜尋區 -->
    <div class="search-section">
      <input v-model="search.cardId" placeholder="借書證號" />
      <input v-model="search.account" placeholder="帳號" />
      <input v-model="search.name" placeholder="姓名" />
      <input v-model="search.email" placeholder="電子郵件" />
      <input v-model="search.phone" placeholder="電話" />
      <button class="btn btn-primary" @click="handleSearch">搜尋</button>
    </div>

    <!-- 會員詳細資訊卡片 -->
    <div v-if="selectedUser" class="user-detail-card">
      <h3>會員詳細資訊</h3>
      <div class="user-info-grid">
        <div class="info-row">
          <span class="label">姓名：</span>
          <span>{{ selectedUser.name }}</span>
        </div>
        <div class="info-row">
          <span class="label">借書證號：</span>
          <span>{{ selectedUser.cardId }}</span>
        </div>
        <div class="info-row">
          <span class="label">帳號：</span>
          <span>{{ selectedUser.account }}</span>
        </div>
        <div class="info-row">
          <span class="label">電子郵件：</span>
          <span>{{ selectedUser.email }}</span>
        </div>
        <div class="info-row">
          <span class="label">電話：</span>
          <span>{{ selectedUser.phone }}</span>
        </div>
        <div class="info-row">
          <span class="label">地址：</span>
          <span>{{ selectedUser.address }}</span>
        </div>
        <div class="info-row">
          <span class="label">角色：</span>
          <span>{{ selectedUser.role }}</span>
        </div>
        <div class="info-row">
          <span class="label">狀態：</span>
          <span :class="getStatusClass(selectedUser.status)">{{ selectedUser.status }}</span>
        </div>
        <div class="info-row">
          <span class="label">罰分：</span>
          <span>{{ selectedUser.penaltyPoints }}</span>
        </div>
      </div>
      
      <!-- 操作按鈕 -->
      <div class="action-buttons">
        <button 
          v-if="selectedUser.status === 'PENDING'" 
          class="btn btn-success"
          @click="activateUser"
        >
          開通帳號
        </button>
        <button 
          v-if="selectedUser.status === 'ACTIVE'" 
          class="btn btn-warning"
          @click="suspendUser"
        >
          停權
        </button>
        <button 
          v-if="selectedUser.status === 'SUSPENDED'" 
          class="btn btn-success"
          @click="restoreUser"
        >
          復權
        </button>
        <button class="btn btn-secondary" @click="viewUserLoans">
          顯示借閱記錄
        </button>
        <button class="btn btn-secondary" @click="viewUserReservations">
          顯示預約記錄
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import adminUsersAPI from '../../api/admin/users'

const router = useRouter()

const search = ref({
  cardId: '',
  account: '',
  name: '',
  email: '',
  phone: ''
})

const selectedUser = ref(null)

const handleSearch = async () => {
  try {
    const results = await adminUsersAPI.search(search.value)
    if (results.length === 0) {
      alert('查無會員')
      selectedUser.value = null
    } else if (results.length === 1) {
      selectedUser.value = results[0]
    } else {
      // 多筆結果，取第一筆或讓使用者選擇
      selectedUser.value = results[0]
      alert(`找到 ${results.length} 筆資料，顯示第一筆`)
    }
  } catch (error) {
    alert('搜尋失敗：' + error)
  }
}

const activateUser = async () => {
  if (!confirm('確定要開通此帳號嗎？')) return
  try {
    await adminUsersAPI.activate(selectedUser.value.id)
    alert('開通成功')
    handleSearch()
  } catch (error) {
    alert('開通失敗：' + error)
  }
}

const suspendUser = async () => {
  if (!confirm('確定要停權此帳號嗎？')) return
  try {
    await adminUsersAPI.suspend(selectedUser.value.id)
    alert('停權成功')
    handleSearch()
  } catch (error) {
    alert('停權失敗：' + error)
  }
}

const restoreUser = async () => {
  if (!confirm('確定要復權此帳號嗎？')) return
  try {
    await adminUsersAPI.restore(selectedUser.value.id)
    alert('復權成功')
    handleSearch()
  } catch (error) {
    alert('復權失敗：' + error)
  }
}

const viewUserLoans = () => {
  window.open(`/admin/user/${selectedUser.value.id}/loans`, '_blank')
}

const viewUserReservations = () => {
  window.open(`/admin/user/${selectedUser.value.id}/reservations`, '_blank')
}

const getStatusClass = (status) => {
  switch (status) {
    case 'ACTIVE': return 'status-active'
    case 'SUSPENDED': return 'status-suspended'
    case 'PENDING': return 'status-pending'
    default: return ''
  }
}
</script>

<style scoped>
.users-management {
  max-width: 1200px;
}

.page-title {
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--primary);
}

.search-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.search-section input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-warning {
  background-color: #f59e0b;
  color: white;
}

.user-detail-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
}

.user-detail-card h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
}

.user-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  gap: 8px;
}

.info-row .label {
  font-weight: 500;
  color: #6b7280;
}

.status-active {
  color: #10b981;
}

.status-suspended {
  color: #ef4444;
}

.status-pending {
  color: #f59e0b;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>

