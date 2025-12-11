<template>
  <div class="register-page">
    <TheHeader />
    
    <div class="register-container">
      <div class="register-card">
        <h1 class="register-title">會員註冊</h1>
        <p class="register-subtitle">註冊後需至圖書館現場啟用帳號</p>
        
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-row">
            <div class="form-group">
              <label for="account">帳號 <span class="required">*</span></label>
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
              <label for="name">姓名 <span class="required">*</span></label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="請輸入真實姓名"
                required
                :disabled="loading"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="password">密碼 <span class="required">*</span></label>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                placeholder="請輸入密碼"
                required
                :disabled="loading"
              />
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">確認密碼 <span class="required">*</span></label>
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                type="password"
                placeholder="請再次輸入密碼"
                required
                :disabled="loading"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">電子郵件 <span class="required">*</span></label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="example@email.com"
              required
              :disabled="loading"
            />
          </div>
          
          <div class="form-group">
            <label for="phone">聯絡電話 <span class="required">*</span></label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              placeholder="請輸入手機號碼"
              required
              :disabled="loading"
            />
          </div>
          
          <div class="form-group">
            <label for="address">地址 <span class="required">*</span></label>
            <input
              id="address"
              v-model="formData.address"
              type="text"
              placeholder="請輸入居住地址"
              required
              :disabled="loading"
            />
          </div>
          
          <div class="notice-box">
            <i class="fa-solid fa-circle-info"></i>
            <div>
              <p><strong>注意事項：</strong></p>
              <ul>
                <li>註冊後帳號狀態為「待啟用」</li>
                <li>請攜帶身分證件至圖書館現場完成啟用</li>
                <li>啟用後才可使用預約與評論功能</li>
              </ul>
            </div>
          </div>
          
          <div v-if="errorMessage" class="error-message">
            <i class="fa-solid fa-circle-exclamation"></i>
            {{ errorMessage }}
          </div>
          
          <div v-if="successMessage" class="success-message">
            <i class="fa-solid fa-circle-check"></i>
            {{ successMessage }}
          </div>
          
          <button type="submit" class="submit-btn" :disabled="loading">
            <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
            <span v-else>註冊</span>
          </button>
        </form>
        
        <div class="form-footer">
          <p>已有帳號？<router-link to="/login" class="link">立即登入</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../api/auth'
import TheHeader from '../components/common/TheHeader.vue'

const router = useRouter()

const formData = reactive({
  account: '',
  password: '',
  confirmPassword: '',
  name: '',
  email: '',
  phone: '',
  address: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  // 驗證
  if (!formData.account || !formData.password || !formData.name || 
      !formData.email || !formData.phone || !formData.address) {
    errorMessage.value = '請填寫所有必填欄位'
    return
  }
  
  if (formData.password !== formData.confirmPassword) {
    errorMessage.value = '兩次輸入的密碼不一致'
    return
  }
  
  if (formData.password.length < 6) {
    errorMessage.value = '密碼長度至少需要 6 個字元'
    return
  }
  
  try {
    loading.value = true
    const response = await authAPI.register({
      account: formData.account,
      password: formData.password,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address
    })
    
    successMessage.value = response.message || '註冊成功！請至圖書館現場啟用帳號'
    
    // 3 秒後導向登入頁
    setTimeout(() => {
      router.push('/login')
    }, 3000)
    
  } catch (error) {
    errorMessage.value = error || '註冊失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: var(--bg);
}

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.register-card {
  background: #fff;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 50px 40px;
  width: 100%;
  max-width: 700px;
  box-shadow: 10px 10px 0 rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.register-title {
  font-family: 'Noto Serif TC', serif;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
  color: var(--primary);
}

.register-subtitle {
  text-align: center;
  color: var(--gray);
  font-size: 14px;
  margin-bottom: 35px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
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

.required {
  color: var(--accent);
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

.notice-box {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f0f8ff;
  border: 1px solid #b3d9ff;
  border-radius: 4px;
  font-size: 13px;
  margin-top: 10px;
}

.notice-box i {
  color: #0066cc;
  font-size: 20px;
  flex-shrink: 0;
}

.notice-box ul {
  margin-top: 8px;
  padding-left: 20px;
  list-style: disc;
}

.notice-box li {
  margin-bottom: 4px;
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

.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f0fff0;
  border: 1px solid var(--success);
  border-radius: 4px;
  color: var(--success);
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

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .register-card {
    padding: 30px 20px;
  }
}
</style>

