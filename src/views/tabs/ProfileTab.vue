<template>
  <div class="profile-tab">
    <h2 class="panel-header">個人資料</h2>
    
    <div v-if="user" class="profile-card">
      <div class="profile-grid">
        <div class="p-label">姓名</div>
        <div class="p-value">{{ user.name }}</div>
        
        <div class="p-label">借書證號</div>
        <div class="p-value">{{ user.cardId }}</div>
        
        <div class="p-label">帳號</div>
        <div class="p-value">{{ user.account }}</div>
        
        <div class="p-label">電子信箱</div>
        <div class="p-value">{{ user.email }}</div>
        
        <div class="p-label">手機號碼</div>
        <div class="p-value">{{ user.phone }}</div>
        
        <div class="p-label">通訊地址</div>
        <div class="p-value">{{ user.address }}</div>
        
        <div class="p-label">身份類別</div>
        <div class="p-value">
          <span class="identity-badge">{{ getRoleText(user.role) }}</span>
        </div>
      </div>
      
      <div class="profile-actions">
        <button class="btn" @click="showEditProfileModal = true">編輯資料</button>
        <button class="btn btn-outline-danger" @click="showChangePasswordModal = true">更改密碼</button>
      </div>
    </div>

    <ChangePasswordModal
      v-if="showChangePasswordModal"
      @close="showChangePasswordModal = false"
      @success="handlePasswordChanged"
    />

    <EditProfileModal
      v-if="showEditProfileModal"
      :user="user"
      @close="showEditProfileModal = false"
      @success="showEditProfileModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import ChangePasswordModal from '../../components/ChangePasswordModal.vue'
import EditProfileModal from '../../components/EditProfileModal.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const showChangePasswordModal = ref(false)
const showEditProfileModal = ref(false)

const getRoleText = (role) => {
  const roleMap = {
    'ROLE_USER': '一般使用者',
    'ROLE_CITIZEN': '市民',
    'ROLE_ADMIN': '管理員'
  }
  return roleMap[role] || role
}

const handlePasswordChanged = () => {
  showChangePasswordModal.value = false
  // 密碼更改成功後，可以考慮強制使用者重新登入
  // authStore.logout()
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

.profile-actions {
  display: flex;
  gap: 20px;
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

.btn-outline-danger {
  border-color: var(--accent);
  color: var(--accent);
}

.btn-outline-danger:hover {
  background: var(--accent);
  color: #fff;
}
</style>
