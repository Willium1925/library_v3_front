<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2 v-if="!isVerified">驗證原密碼</h2>
      <h2 v-else>設定新密碼</h2>

      <!-- Step 1: Verify Old Password -->
      <form v-if="!isVerified" @submit.prevent="handleVerify">
        <div class="form-group">
          <label for="oldPassword">請輸入原密碼</label>
          <input
            type="password"
            id="oldPassword"
            v-model="oldPassword"
            required
            :disabled="isLoading"
          />
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="close" :disabled="isLoading">取消</button>
          <button type="submit" class="btn" :disabled="isLoading">
            {{ isLoading ? '驗證中...' : '下一步' }}
          </button>
        </div>
      </form>

      <!-- Step 2: Set New Password -->
      <form v-else @submit.prevent="handleChangePassword">
        <div class="form-group">
          <label for="newPassword">新密碼</label>
          <input
            type="password"
            id="newPassword"
            v-model="newPassword"
            required
            :disabled="isLoading"
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">確認新密碼</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            :disabled="isLoading"
          />
          <p v-if="passwordMismatch" class="error-text">兩次輸入的密碼不一致</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="reset" :disabled="isLoading">上一步</button>
          <button type="submit" class="btn" :disabled="isLoading || passwordMismatch">
            {{ isLoading ? '更新中...' : '確認更新' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { authAPI } from '../api/auth'

const emit = defineEmits(['close', 'success'])

const isLoading = ref(false)
const isVerified = ref(false)

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const passwordMismatch = computed(() => {
  return newPassword.value && confirmPassword.value && newPassword.value !== confirmPassword.value
})

const handleVerify = async () => {
  isLoading.value = true
  try {
    await authAPI.verifyOldPassword(oldPassword.value)
    isVerified.value = true
  } catch (error) {
    alert('原密碼錯誤，請重新輸入。')
    console.error('密碼驗證失敗:', error)
  } finally {
    isLoading.value = false
  }
}

const handleChangePassword = async () => {
  if (passwordMismatch.value) {
    return
  }
  isLoading.value = true
  try {
    await authAPI.changePassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    })
    alert('密碼更新成功！')
    emit('success')
    close()
  } catch (error) {
    alert('密碼更新失敗，請稍後再試。')
    console.error('密碼更新失敗:', error)
  } finally {
    isLoading.value = false
  }
}

const reset = () => {
  isVerified.value = false
  newPassword.value = ''
  confirmPassword.value = ''
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
  width: 400px;
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

.error-text {
  color: var(--accent);
  font-size: 12px;
  margin-top: 5px;
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

.btn.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn.btn-secondary:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.btn {
  background-color: var(--primary);
  color: white;
}

.btn:hover:not(:disabled) {
  background-color: #A55;
}
</style>
