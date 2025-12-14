<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <!-- Edit Form -->
      <div v-if="!isPreview">
        <h2>編輯個人資料</h2>
        <form @submit.prevent="showPreview">
          <div class="form-group">
            <label for="account">帳號</label>
            <input type="text" id="account" v-model="editableUser.account" required />
          </div>
          <div class="form-group">
            <label for="name">姓名</label>
            <input type="text" id="name" v-model="editableUser.name" required />
          </div>
          <div class="form-group">
            <label for="email">電子信箱</label>
            <input type="email" id="email" v-model="editableUser.email" required />
          </div>
          <div class="form-group">
            <label for="phone">手機號碼</label>
            <input type="tel" id="phone" v-model="editableUser.phone" />
          </div>
          <div class="form-group">
            <label for="address">通訊地址</label>
            <input type="text" id="address" v-model="editableUser.address" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="close">取消</button>
            <button type="submit" class="btn">預覽變更</button>
          </div>
        </form>
      </div>

      <!-- Preview -->
      <div v-else>
        <h2>確認資料</h2>
        <div class="profile-grid">
          <div class="p-label">帳號</div>
          <div class="p-value">{{ editableUser.account }}</div>
          <div class="p-label">姓名</div>
          <div class="p-value">{{ editableUser.name }}</div>
          <div class="p-label">電子信箱</div>
          <div class="p-value">{{ editableUser.email }}</div>
          <div class="p-label">手機號碼</div>
          <div class="p-value">{{ editableUser.phone || '未提供' }}</div>
          <div class="p-label">通訊地址</div>
          <div class="p-value">{{ editableUser.address || '未提供' }}</div>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="hidePreview" :disabled="isLoading">返回編輯</button>
          <button type="button" class="btn" @click="submitUpdate" :disabled="isLoading">
            {{ isLoading ? '更新中...' : '確認送出' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import { authAPI } from '../api/auth'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()

const isPreview = ref(false)
const isLoading = ref(false)

// Create a deep copy for editing
const editableUser = reactive(JSON.parse(JSON.stringify(props.user)))

const showPreview = () => {
  isPreview.value = true
}

const hidePreview = () => {
  isPreview.value = false
}

const submitUpdate = async () => {
  isLoading.value = true
  try {
    const updatedUserData = await authAPI.updateUserProfile(editableUser)
    // Call the new action to update both token and user state
    authStore._setTokenAndUser(updatedUserData)
    alert('個人資料更新成功！')
    emit('success')
    close()
  } catch (error) {
    const errorMessage = error.response?.data?.message || '更新失敗，請稍後再試。'
    alert(errorMessage)
    console.error('更新失敗:', error)
  } finally {
    isLoading.value = false
  }
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 30px 40px;
  border-radius: 8px;
  width: 500px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

h2 {
  font-family: 'Noto Serif TC', serif;
  font-size: 24px;
  margin-bottom: 25px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.btn {
  background-color: var(--primary);
  color: white;
}

.btn:hover:not(:disabled) {
  background-color: #A55;
}

/* Preview styles */
.profile-grid {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 15px;
}

.p-label {
  font-weight: 700;
  color: var(--gray);
}

.p-value {
  font-weight: 500;
  word-break: break-all;
}
</style>
