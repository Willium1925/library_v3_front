<template>
  <div class="profile-tab">
    <h2 class="panel-header">個人資料</h2>
    
    <div v-if="user" class="profile-card">
      <div class="profile-grid">
        <span class="p-label">姓名：</span>
        <span class="p-value">{{ user.name }}</span>
        
        <span class="p-label">帳號：</span>
        <span class="p-value">{{ user.account }}</span>
        
        <span class="p-label">身份：</span>
        <span class="p-value">
          <span class="identity-badge">{{ getRoleText(user.role) }}</span>
        </span>
        
        <span class="p-label">狀態：</span>
        <span class="p-value">
          <span :class="getStatusClass(user.status)">{{ getStatusText(user.status) }}</span>
          <span v-if="user.suspendedUntil" class="suspend-date">
            （解除日期：{{ formatDate(user.suspendedUntil) }}）
          </span>
        </span>
        
        <span class="p-label">違約點數：</span>
        <span class="p-value">
          <span class="penalty-points">{{ user.penaltyPoints || 0 }} 點</span>
        </span>
        
        <span class="p-label">註冊日期：</span>
        <span class="p-value">{{ formatDate(user.createdAt) }}</span>
      </div>
      
      <div class="profile-actions">
        <button class="btn btn-primary" @click="handleEditProfile">
          <i class="fa-solid fa-pen"></i>
          編輯資料
        </button>
        <button class="btn btn-secondary" @click="handleChangePassword">
          <i class="fa-solid fa-key"></i>
          修改密碼
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const getRoleText = (role) => {
  const roleMap = {
    'ROLE_USER': '一般使用者',
    'ROLE_CITIZEN': '台中市民',
    'ROLE_ADMIN': '管理員'
  }
  return roleMap[role] || role
}

const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '尚未啟用，請攜帶相關證件至本館開通',
    'ACTIVE': '正常',
    'SUSPENDED': '停權中'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  return {
    'status-pending': status === 'PENDING',
    'status-active': status === 'ACTIVE',
    'status-suspended': status === 'SUSPENDED'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW')
}

const handleEditProfile = () => {
  alert('編輯資料功能開發中')
}

const handleChangePassword = () => {
  alert('修改密碼功能開發中')
}
</script>

<style scoped>
.profile-tab {
  animation: fadeIn 0.3s;
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

.panel-header {
  font-family: 'Noto Serif TC', serif;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--primary);
}

.profile-card {
  background: #fff;
  border: 1px solid var(--border-color);
  padding: 40px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 20px;
  margin-bottom: 40px;
}

.p-label {
  font-weight: 700;
  color: var(--gray);
}

.p-value {
  font-weight: 500;
}

.identity-badge {
  display: inline-block;
  padding: 4px 10px;
  background: var(--primary);
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
}

.status-pending {
  color: #ff9800;
  font-weight: 700;
}

.status-active {
  color: var(--success);
  font-weight: 700;
}

.status-suspended {
  color: var(--accent);
  font-weight: 700;
}

.suspend-date {
  font-size: 12px;
  color: var(--gray);
  margin-left: 10px;
}

.penalty-points {
  color: var(--accent);
  font-weight: 700;
}

.profile-actions {
  display: flex;
  gap: 20px;
}

.btn {
  padding: 10px 25px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--gray);
}

.btn-secondary {
  background: #f0f0f0;
  color: var(--primary);
  border: 1px solid var(--light-border);
}

.btn-secondary:hover {
  background: #e0e0e0;
}
</style>

