<template>
  <div class="login-page">
    <TheHeader />
    
    <div class="login-container">
      <div class="login-card">
        <h1 class="login-title">會員登入</h1>
        
        <!-- 快速填入按鈕 -->
        <div class="quick-fill" aria-hidden="false">
          <button type="button" class="quick-btn" @click="fillQuick('adminJAVA1925', '123456789')">Admin</button>
          <button type="button" class="quick-btn" @click="fillQuick('citizen777', '123456789')">Citizen</button>
          <button type="button" class="quick-btn" @click="fillQuick('user1925', '123456789')">User</button>
          <small class="quick-hint">快速填入測試帳號</small>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="account">帳號</label>
            <input
              id="account"
              v-model="formData.account"
              type="text"
              placeholder="請輸入帳號"
              required
              :disabled="loading"
            />
          </div>
          
          <div class="form-group">
            <label for="password">密碼</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="請輸入密碼"
              required
              :disabled="loading"
            />
          </div>
          
          <div v-if="errorMessage" class="error-message">
            <i class="fa-solid fa-circle-exclamation"></i>
            {{ errorMessage }}
          </div>
          
          <button type="submit" class="submit-btn" :disabled="loading">
            <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
            <span v-else>登入</span>
          </button>
        </form>
        
        <div class="form-footer">
          <p>還沒有帳號？<router-link to="/register" class="link">立即註冊</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import TheHeader from '../components/common/TheHeader.vue'

const router = useRouter()
const authStore = useAuthStore()

const formData = reactive({
  account: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

// 快速填入處理函式
const fillQuick = (account, password) => {
  formData.account = account
  formData.password = password
}

const handleLogin = async () => {
  errorMessage.value = ''
  
  if (!formData.account || !formData.password) {
    errorMessage.value = '請填寫完整資料'
    return
  }
  
  try {
    loading.value = true
    await authStore.login({
      account: formData.account,
      password: formData.password
    })
    
    // 登入成功，導向原本要去的頁面或首頁
    const redirect = router.currentRoute.value.query.redirect || '/'
    router.push(redirect)
  } catch (error) {
    errorMessage.value = error || '登入失敗，請檢查帳號密碼'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: var(--bg);
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 40px 20px;
}

.login-card {
  background: #fff;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 50px 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 10px 10px 0 rgba(0, 0, 0, 0.1);
}

.login-title {
  font-family: 'Noto Serif TC', serif;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
  color: var(--primary);
}

/* 快速填入按鈕樣式 */
.quick-fill {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.quick-btn {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px dashed var(--primary);
  background: rgba(0,0,0,0.02);
  cursor: pointer;
  font-weight: 600;
  color: var(--primary);
}
.quick-btn:hover {
  background: rgba(0,0,0,0.04);
}
.quick-hint {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: var(--gray);
  margin-top: 6px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  font-size: 14px;
  color: var(--primary);
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid var(--light-border);
  border-radius: 4px;
  font-size: 15px;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fff0f0;
  border: 1px solid var(--accent);
  border-radius: 4px;
  color: var(--accent);
  font-size: 14px;
}

.submit-btn {
  padding: 14px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  background: #000;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-footer {
  margin-top: 30px;
  text-align: center;
  font-size: 14px;
  color: var(--gray);
}

.link {
  color: var(--primary);
  font-weight: 600;
  text-decoration: underline;
  transition: opacity 0.2s;
}

.link:hover {
  opacity: 0.7;
}
</style>
