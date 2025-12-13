<template>
  <div class="return-page">
    <h2 class="page-title">還書管理</h2>

    <!-- 第一區：輸入區 -->
    <div class="input-section">
      <div class="input-group">
        <label>書籍碼</label>
        <div class="input-with-button">
          <input 
            v-model="uniqueCode" 
            type="text" 
            placeholder="請輸入書籍碼"
            @keyup.enter="handleReturn"
          />
          <button 
            class="btn btn-primary" 
            @click="handleReturn" 
            :disabled="loading"
          >
            執行還書
          </button>
        </div>
      </div>
    </div>

    <!-- 第二區：會員資訊卡片（歸還後顯示） -->
    <div v-if="userInfo" class="user-card">
      <h3>會員資訊（歸還後）</h3>
      <div class="user-info-grid">
        <div class="info-item">
          <span class="label">姓名：</span>
          <span class="value">{{ userInfo.name || '未知' }}</span>
        </div>
        <div class="info-item">
          <span class="label">借書證號：</span>
          <span class="value">{{ userInfo.cardId || '未知' }}</span>
        </div>
        <div class="info-item">
          <span class="label">罰分：</span>
          <span class="value" :class="{ 'text-danger': (userInfo.penaltyPoints || 0) >= 10 }">
            {{ userInfo.penaltyPoints || 0 }} 分
          </span>
        </div>
      </div>
    </div>

    <!-- 第三區：本次歸還清單 -->
    <div v-if="returnList.length > 0" class="return-list">
      <h3>本次歸還清單</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>書籍碼</th>
            <th>歸還時間</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in returnList" :key="index">
            <td>{{ item.uniqueCode }}</td>
            <td>{{ formatDateTime(item.returnTime) }}</td>
            <td class="text-success">{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import adminLoansAPI from '../../api/admin/loans'

const uniqueCode = ref('')
const userInfo = ref(null)
const returnList = ref([])
const loading = ref(false)

const handleReturn = async () => {
  if (!uniqueCode.value.trim()) {
    alert('請輸入書籍碼')
    return
  }

  try {
    loading.value = true
    const response = await adminLoansAPI.return({
      uniqueCode: uniqueCode.value
    })

    if (response.success) {
      alert('還書成功！')
      // 將成功歸還的書籍加入清單
      returnList.value.push({
        uniqueCode: uniqueCode.value,
        returnTime: new Date().toISOString(),
        status: '已歸還'
      })
      
      // 如果回應中有會員資訊，顯示它
      if (response.userInfo) {
        userInfo.value = response.userInfo
      }
      
      uniqueCode.value = ''
    } else {
      alert('還書失敗：' + (response.message || '未知錯誤'))
    }
  } catch (error) {
    alert('還書失敗：' + error)
  } finally {
    loading.value = false
  }
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('zh-TW')
}
</script>

<style scoped>
.return-page {
  max-width: 1200px;
}

.page-title {
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--primary);
}

.input-section {
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.input-group {
  max-width: 600px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.input-with-button {
  display: flex;
  gap: 8px;
}

.input-with-button input {
  flex: 1;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.user-card, .return-list {
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.user-card h3, .return-list h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.user-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  gap: 8px;
}

.info-item .label {
  color: #6b7280;
  font-weight: 500;
}

.info-item .value {
  color: #111827;
  font-weight: 600;
}

.text-danger {
  color: #ef4444;
}

.text-success {
  color: #10b981;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background-color: #f9fafb;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
}
</style>

