<template>
  <div class="borrow-page">
    <h2 class="page-title">借書管理</h2>

    <!-- 第一區：輸入區 -->
    <div class="input-section">
      <div class="input-group">
        <label>借書證號</label>
        <div class="input-with-button">
          <input 
            v-model="cardId" 
            type="text" 
            placeholder="請輸入借書證號"
            @keyup.enter="fetchUser"
          />
          <button class="btn btn-primary" @click="fetchUser" :disabled="loading">
            查詢會員
          </button>
        </div>
      </div>

      <div class="input-group">
        <label>書籍碼</label>
        <div class="input-with-button">
          <input 
            v-model="uniqueCode" 
            type="text" 
            placeholder="請輸入書籍碼"
            @keyup.enter="handleBorrow"
            :disabled="!userInfo"
          />
          <button 
            class="btn btn-success" 
            @click="handleBorrow" 
            :disabled="!userInfo || loading"
          >
            執行借書
          </button>
        </div>
      </div>
    </div>

    <!-- 第二區：會員資訊卡片 -->
    <div v-if="userInfo" class="user-card">
      <h3>會員資訊</h3>
      <div class="user-info-grid">
        <div class="info-item">
          <span class="label">姓名：</span>
          <span class="value">{{ userInfo.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">借書證號：</span>
          <span class="value">{{ userInfo.cardId }}</span>
        </div>
        <div class="info-item">
          <span class="label">狀態：</span>
          <span class="value" :class="statusClass">{{ statusText }}</span>
        </div>
        <div class="info-item">
          <span class="label">角色：</span>
          <span class="value">{{ roleText }}</span>
        </div>
        <div class="info-item">
          <span class="label">罰分：</span>
          <span class="value" :class="{ 'text-danger': userInfo.penaltyPoints >= 10 }">
            {{ userInfo.penaltyPoints }} 分
          </span>
        </div>
        <div class="info-item">
          <span class="label">借閱數量：</span>
          <span class="value">
            {{ userInfo.currentLoansCount }} / {{ userInfo.maxLoansAllowed }}
          </span>
        </div>
      </div>
    </div>

    <!-- 第三區：本次借閱清單 -->
    <div v-if="borrowList.length > 0" class="borrow-list">
      <h3>本次借閱清單</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>書名</th>
            <th>書籍碼</th>
            <th>借閱日期</th>
            <th>到期日期</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in borrowList" :key="item.uniqueCode">
            <td>{{ item.title }}</td>
            <td>{{ item.uniqueCode }}</td>
            <td>{{ formatDate(item.loanDate) }}</td>
            <td class="text-primary">{{ formatDate(item.dueDate) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import adminUsersAPI from '../../api/admin/users'
import adminLoansAPI from '../../api/admin/loans'

const cardId = ref('')
const uniqueCode = ref('')
const userInfo = ref(null)
const borrowList = ref([])
const loading = ref(false)

const statusClass = computed(() => {
  if (!userInfo.value) return ''
  switch (userInfo.value.status) {
    case 'ACTIVE': return 'text-success'
    case 'SUSPENDED': return 'text-danger'
    case 'PENDING': return 'text-warning'
    default: return ''
  }
})

const statusText = computed(() => {
  if (!userInfo.value) return ''
  switch (userInfo.value.status) {
    case 'ACTIVE': return '已啟用'
    case 'SUSPENDED': return '已停權'
    case 'PENDING': return '待啟用'
    default: return userInfo.value.status
  }
})

const roleText = computed(() => {
  if (!userInfo.value) return ''
  switch (userInfo.value.role) {
    case 'ROLE_ADMIN': return '管理員'
    case 'ROLE_CITIZEN': return '市民'
    case 'ROLE_USER': return '一般會員'
    default: return userInfo.value.role
  }
})

const fetchUser = async () => {
  if (!cardId.value.trim()) {
    alert('請輸入借書證號')
    return
  }

  try {
    loading.value = true
    userInfo.value = await adminUsersAPI.getByCardId(cardId.value)
  } catch (error) {
    alert('查詢會員失敗：' + error)
    userInfo.value = null
  } finally {
    loading.value = false
  }
}

const handleBorrow = async () => {
  if (!uniqueCode.value.trim()) {
    alert('請輸入書籍碼')
    return
  }

  try {
    loading.value = true
    const response = await adminLoansAPI.borrow({
      uniqueCode: uniqueCode.value,
      cardId: cardId.value
    })

    if (response.success) {
      alert('借書成功！')
      // 將成功借閱的書籍加入清單
      borrowList.value.push({
        title: response.title || '未知書名',
        uniqueCode: uniqueCode.value,
        loanDate: new Date().toISOString(),
        dueDate: response.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })
      uniqueCode.value = ''
      // 重新查詢會員資訊以更新借閱數量
      await fetchUser()
    } else {
      alert('借書失敗：' + (response.message || '未知錯誤'))
    }
  } catch (error) {
    alert('借書失敗：' + error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-TW')
}
</script>

<style scoped>
.borrow-page {
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
  display: flex;
  gap: 24px;
}

.input-group {
  flex: 1;
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

.input-with-button input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
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

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #059669;
}

.user-card, .borrow-list {
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.user-card h3, .borrow-list h3 {
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

.text-success {
  color: #10b981;
}

.text-danger {
  color: #ef4444;
}

.text-warning {
  color: #f59e0b;
}

.text-primary {
  color: var(--primary);
  font-weight: 600;
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

