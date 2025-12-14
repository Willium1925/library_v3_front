<template>
  <div class="users-management">
    <h2 class="page-title">會員管理</h2>

    <!-- 搜尋區 -->
    <div class="search-section">
      <input v-model="search.cardId" placeholder="借書證號" @keyup.enter="handleSearch" />
      <input v-model="search.account" placeholder="帳號" @keyup.enter="handleSearch" />
      <input v-model="search.name" placeholder="姓名" @keyup.enter="handleSearch" />
      <input v-model="search.email" placeholder="電子郵件" @keyup.enter="handleSearch" />
      <input v-model="search.phone" placeholder="電話" @keyup.enter="handleSearch" />
      <button class="btn btn-primary" @click="handleSearch" :disabled="isLoading">
        {{ isLoading ? '搜尋中...' : '搜尋' }}
      </button>
    </div>

    <!-- 搜尋結果列表 -->
    <div class="results-section" v-if="users.length > 0">
      <table class="results-table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>帳號</th>
            <th>電子郵件</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" :class="{ 'selected-row': selectedUser && selectedUser.id === user.id }">
            <td>{{ user.name }}</td>
            <td>{{ user.account }}</td>
            <td>{{ user.email }}</td>
            <td><span :class="getStatusClass(user.status)">{{ user.status }}</span></td>
            <td>
              <button class="btn btn-sm btn-secondary" @click="selectUser(user)">
                查看詳情
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="searched && users.length === 0" class="no-results">
      查無符合條件的會員
    </div>

    <!-- 會員詳細資訊卡片 -->
    <div v-if="selectedUser" class="user-detail-card">
      <h3>會員詳細資訊</h3>
      <div class="user-info-grid">
        <div class="info-row"><span class="label">姓名：</span><span>{{ selectedUser.name }}</span></div>
        <div class="info-row"><span class="label">借書證號：</span><span>{{ selectedUser.cardId }}</span></div>
        <div class="info-row"><span class="label">帳號：</span><span>{{ selectedUser.account }}</span></div>
        <div class="info-row"><span class="label">電子郵件：</span><span>{{ selectedUser.email }}</span></div>
        <div class="info-row"><span class="label">電話：</span><span>{{ selectedUser.phone }}</span></div>
        <div class="info-row"><span class="label">地址：</span><span>{{ selectedUser.address }}</span></div>
        <div class="info-row"><span class="label">角色：</span><span>{{ selectedUser.role }}</span></div>
        <div class="info-row"><span class="label">狀態：</span><span :class="getStatusClass(selectedUser.status)">{{ selectedUser.status }}</span></div>
        <div class="info-row"><span class="label">罰分：</span><span>{{ selectedUser.penaltyPoints }}</span></div>
      </div>
      
      <div class="action-buttons">
        <button v-if="selectedUser.status === 'PENDING'" class="btn btn-success" @click="activateUser">開通帳號</button>
        <button v-if="selectedUser.status === 'ACTIVE'" class="btn btn-warning" @click="suspendUser">停權</button>
        <button v-if="selectedUser.status === 'SUSPENDED'" class="btn btn-success" @click="restoreUser">復權</button>
        <button
          class="btn btn-secondary"
          :class="{ 'btn-active': showLoans }"
          @click="toggleLoans"
        >
          顯示借閱記錄
        </button>
        <button
          class="btn btn-secondary"
          :class="{ 'btn-active': showReservations }"
          @click="toggleReservations"
        >
          顯示預約記錄
        </button>
      </div>

      <!-- Embedded loan and reservation components -->
      <div v-if="showLoans" class="embedded-section">
        <UserLoanHistory :userId="selectedUser.id" />
      </div>

      <div v-if="showReservations" class="embedded-section">
        <UserReservationHistory :userId="selectedUser.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import adminUsersAPI from '../../api/admin/users'
import UserLoanHistory from './UserLoanHistory.vue'
import UserReservationHistory from './UserReservationHistory.vue'

const router = useRouter()

const search = ref({
  cardId: '',
  account: '',
  name: '',
  email: '',
  phone: ''
})

const isLoading = ref(false)
const searched = ref(false) // 用於追蹤是否執行過搜尋
const users = ref([]) // 用於儲存搜尋結果列表
const selectedUser = ref(null) // 用於儲存當前選擇的用戶

// New toggles for embedded views
const showLoans = ref(false)
const showReservations = ref(false)

const handleSearch = async () => {
  isLoading.value = true
  searched.value = true
  selectedUser.value = null // 每次搜尋時清空已選中的用戶
  // hide embedded panels when searching
  showLoans.value = false
  showReservations.value = false
  try {
    users.value = await adminUsersAPI.search(search.value)
    if (users.value.length === 0) {
      alert('查無會員')
    }
  } catch (error) {
    alert('搜尋失敗：' + error)
    users.value = []
  } finally {
    isLoading.value = false
  }
}

const selectUser = (user) => {
  selectedUser.value = user
  // reset panels when selecting a new user
  showLoans.value = false
  showReservations.value = false
}

const updateUserStatus = async (apiCall, successMessage) => {
  if (!selectedUser.value || !confirm(`確定要${successMessage.slice(0, 2)}此帳號嗎？`)) return
  try {
    await apiCall(selectedUser.value.id)
    alert(successMessage)
    // 刷新當前選中用戶的狀態
    const updatedUser = await adminUsersAPI.getById(selectedUser.value.id)
    selectedUser.value = updatedUser
    // 同時更新列表中的用戶狀態
    const index = users.value.findIndex(u => u.id === updatedUser.id)
    if (index !== -1) {
      users.value[index] = updatedUser
    }
  } catch (error) {
    alert(`${successMessage.slice(0, 2)}失敗：` + error)
  }
}

const activateUser = () => updateUserStatus(adminUsersAPI.activate, '開通成功')
const suspendUser = () => updateUserStatus(adminUsersAPI.suspend, '停權成功')
const restoreUser = () => updateUserStatus(adminUsersAPI.restore, '復權成功')

// Replaced window.open with toggles that show embedded components
const toggleLoans = () => {
  showLoans.value = !showLoans.value
  // ensure only one panel visible at a time (optional)
  if (showLoans.value) showReservations.value = false
}

const toggleReservations = () => {
  showReservations.value = !showReservations.value
  if (showReservations.value) showLoans.value = false
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
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-primary { background-color: var(--primary); color: white; }
.btn-secondary { background-color: #6b7280; color: white; }
.btn-success { background-color: #10b981; color: white; }
.btn-warning { background-color: #f59e0b; color: white; }
.btn-sm { padding: 4px 8px; font-size: 12px; }

.results-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.results-table {
  width: 100%;
  border-collapse: collapse;
}
.results-table th, .results-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}
.results-table th {
  font-weight: 600;
  color: #4b5563;
}
.selected-row {
  background-color: #fef3c7; /* A light yellow highlight */
  /* ensure selected row text is black for better contrast */
  color: #000;
}
/* Also ensure table cells in selected row are black */
.selected-row td { color: #000; }
.no-results {
  background: white;
  padding: 40px;
  text-align: center;
  color: #6b7280;
  border-radius: 8px;
}

/* Active toggle button style (black) */
.btn-active {
  background-color: #111;
  color: #fff;
}

.user-detail-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  border: 2px solid var(--primary);
  margin-top: 20px;
}
.user-detail-card h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
}
.user-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.info-row { display: flex; gap: 8px; }
.info-row .label { font-weight: 500; color: #6b7280; }
.status-active { color: #10b981; font-weight: bold; }
.status-suspended { color: #ef4444; font-weight: bold; }
.status-pending { color: #f59e0b; font-weight: bold; }
.action-buttons { display: flex; gap: 8px; flex-wrap: wrap; }

/* Embedded sections style */
.embedded-section { margin-top: 16px; padding-top: 12px; border-top: 1px dashed #e5e7eb; }
</style>
